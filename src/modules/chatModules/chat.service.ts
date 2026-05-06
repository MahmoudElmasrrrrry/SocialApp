import { Types } from "mongoose";
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
    };

    createGroupChat = async(req:Request, res: Response)=>{
        const authUser: HUserDocument = res.locals.user;
        const {group, participants} : {group:string, participants: Types.ObjectId[]}= req.body;
        const dbParticipants = await this.userModel.find({
            filter: {
                _id: { 
                    $in: participants
                }
            }
        });

        if(dbParticipants.length !== participants.length){
            throw new NotFoundException("Some participants not found");
        }

        
        const newGroup = await this.chatModel.create({
            data:{
                group,
                participants:[...dbParticipants.map(user => user._id), authUser._id],
                createdBy: authUser._id,
                roomId:  Date.now().toString(),
            }
        });

        return successHandler({res, data: newGroup, message:"Group chat created successfully"})
    }

    getGroupChats = async(req:Request, res: Response)=>{
        const {groupId} = req.params as {groupId:string};
        const authUser: HUserDocument = res.locals.user;
        const groups = await this.chatModel.find({
            filter:{
                group:{
                    $exists: true
                },
                participants:{
                    $in: [authUser._id]
                }
            },
            options:{
                populate:[{
                    path:'messages.createdBy',
                    select:'firstName lastName profileImage'
                }]
            }
        });

        return successHandler({res, data: groups, message:"Success"})
    }

    
}