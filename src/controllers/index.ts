import validator from "validator";
import { PrismaClient } from "@prisma/client";
import jwt from "jsonwebtoken";
import { customError } from "../handlers/errorHandler";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

export { validator, prisma, jwt, customError, bcrypt };
