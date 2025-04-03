import { Request, Response, NextFunction } from "express";
import { successResponse, errorResponse } from '../utils/responses.util';
import { prismaDb } from "../lib/intializePrisma";

export const homePage = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const prisma = await prismaDb();
    successResponse(res, 200).render("index", {shortUrl: null });
  } catch (error) {
    console.error('HomePage Error:', error);
    errorResponse(res, 500).json({ error: 'Internal Server Error' });
  }
}

export const postToDb = async (req: Request, res: Response, next: NextFunction) => {
  const { longUrl } = req.body;

  if (!longUrl || typeof longUrl !== 'string') {
   errorResponse(res, 400).json({ error: 'Valid URL is required' });
  }

  try {
    const prisma = await prismaDb();
    const trimmedUrl = longUrl.trim();

    const existingUrl = await prisma.url.findFirst({
      where: { longUrl: trimmedUrl }
    });

    if (existingUrl) {
     errorResponse(res, 200).render("index", {shortUrl: `${req.protocol}://${req.get('host')}/v1/${existingUrl.shortUrl}` })
    }

    const shortenedUrl = Math.random().toString(36).substring(2, 8);
    const results = await prisma.url.create({
      data: {
        longUrl: trimmedUrl,
        shortUrl: shortenedUrl,
        createdAt: new Date()
      }
    });

    successResponse(res, 201).render("index", {shortUrl: `${req.protocol}://${req.get('host')}/v1/${shortenedUrl}` });
  } catch (error) {
    console.error('PostToDb Error:', error);
  errorResponse(res, 500).json({ error: 'Internal Server Error' });
  }
}

export const redirectToLongUrl = async (req: Request, res: Response, next: NextFunction) => {
  const { shortUrl } = req.params;

  if (!shortUrl) {
    errorResponse(res, 400).json({ error: 'Short URL parameter is required' });
  }

  try {
    const prisma = await prismaDb();
    const url = await prisma.url.findFirst({
      where: { shortUrl }
    });

    if (!url) {
      errorResponse(res, 404).json({ message: 'URL not found' });
    }

   res.redirect(url.longUrl);
  } catch (error) {
    console.error('RedirectToLongUrl Error:', error);
    errorResponse(res, 500).json({ error: 'Internal Server Error' });
  }
}