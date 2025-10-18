"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
// In a production environment, you would fetch these from AWS Parameter Store/Secrets Manager
// For example, using the AWS SDK v3:
// import { GetParametersCommand, SSMClient } from "@aws-sdk/client-ssm";
// const ssmClient = new SSMClient({ region: "your-region" });
// const command = new GetParametersCommand({ Names: ["MONGO_URI", "JWT_SECRET"], WithDecryption: true });
// const { Parameters } = await ssmClient.send(command);
// Parameters.forEach(p => { process.env[p.Name] = p.Value; });
const config = {
    port: process.env.PORT || 4000,
    mongoUri: process.env.MONGO_URI,
    mongoUriInfoTrek: process.env.MONGO_URI_InfoTrek,
    jwt: {
        secret: process.env.JWT_SECRET,
        expiresIn: process.env.JWT_EXPIRES_IN || "1h",
    },
    clientOrigin: process.env.CLIENT_ORIGIN || "http://localhost:5173",
};
if (!config.mongoUri || !config.jwt.secret) {
    console.error("FATAL ERROR: Missing required environment variables (MONGO_URI, JWT_SECRET).");
    process.exit(1);
}
exports.default = config;
