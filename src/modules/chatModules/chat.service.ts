import { ChatRepo } from "../../DB/repos/chat.repo";
import { UserRepo } from "../../DB/repos/user.repo";
import { NotFoundException } from "../../utils/errors/types";
import { successHandler } from "../../utils/successHandler";
import { HUserDocument } from "../userModules/user.types";
import {Request, Response} from "express"


export class ChatService{
    private readonly chatModel = new ChatRepo();
    private readonly userModel = new UserRepo();

    getChat = async(req:Request, res: Response)=>{
        const authUser: HUserDocument = res.locals.user
        const {id} = req.params as {id: string}
        const friend = await this.userModel.findById({id})
        if(!friend){
            throw new NotFoundException("Not fount user")
        }

        let chat = await this.chatModel.findOne({
            filter:{
                group:{
                    $exists: false,
                },
                participants:{
                    $all:[authUser._id, friend._id]
                }
            },
            options:{
                populate:[{
                    path:'participants',
                    select:'firstName lastName profileImage'
                }]
            }
        })

        if(!chat){
            chat = await this.chatModel.create({
                data:{
                    participants:[authUser._id, friend._id],
                    createdBy: authUser._id,
                    messages:[]
                }
            })
            chat = await chat.populate('participants');
        }
        
        return successHandler({res, data: chat, message:"Success"})
    }
}