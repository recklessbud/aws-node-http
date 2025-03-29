import { Request, Response, NextFunction } from "express";
import {successResponse , errorResponse} from '../utils/responses.util'
import { prismaDb } from "../lib/intializePrisma";
// import prisma from "../config/database.config

export const homePage = async(req: Request, res: Response, next: NextFunction) => {
  try {
    const prisma = await prismaDb();
    const data = await prisma.url.findMany();
    successResponse(res, 200).json({message:'Reviewed from database', data:data});
    return;
  } catch (error) {
    console.error(error)
    errorResponse(res, 500).json({ error: 'Internal Server Error' });
    return
  }
 
}

export const postToDb = async(req: Request, res: Response, next: NextFunction) => {
    const { name, food } = req.body;
    try {
    const prisma = await prismaDb();
     if(!name){
      errorResponse(res, 400).json({ error: 'Name is required' });
     }
      const create = await prisma.url.create({
        data:{
            originalUrl:name,
            food: food
        }
      })
      successResponse(res, 201).json({message:'Url added to database', data:create});
    } catch (error) {
        console.error(error)
        errorResponse(res, 500).json({ error: 'Internal Server Error' });
    }
}