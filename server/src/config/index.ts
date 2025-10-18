import dotenv from "dotenv";
dotenv.config();

// In a production environment, you would fetch these from AWS Parameter Store/Secrets Manager
// For example, using the AWS SDK v3:
// import { GetParametersCommand, SSMClient } from "@aws-sdk/client-ssm";
// const ssmClient = new SSMClient({ region: "your-region" });
// const command = new GetParametersCommand({ Names: ["MONGO_URI", "JWT_SECRET"], WithDecryption: true });
// const { Parameters } = await ssmClient.send(command);
// Parameters.forEach(p => { process.env[p.Name] = p.Value; });

const config = {
  port: process.env.PORT || 4000,
  mongoUri: process.env.MONGO_URI as string,
  mongoUriInfoTrek: process.env.MONGO_URI_InfoTrek as string,
  jwt: {
    secret: process.env.JWT_SECRET as string,
    expiresIn: process.env.JWT_EXPIRES_IN || "1h",
  },
  clientOrigin: process.env.CLIENT_ORIGIN || "http://localhost:5173",
};

if (!config.mongoUri || !config.jwt.secret) {
  console.error(
    "FATAL ERROR: Missing required environment variables (MONGO_URI, JWT_SECRET)."
  );
  process.exit(1);
}

export default config;
