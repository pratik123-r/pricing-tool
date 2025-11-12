import { join } from 'path';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';

export interface GrpcConfigOptions {
  package: string;
  protoPath: string;
  url: string;
}

export const getGrpcConfig = (options: GrpcConfigOptions): MicroserviceOptions => {
  const { package: pkg, protoPath, url } = options;
  
  return {
    transport: Transport.GRPC,
    options: {
      package: pkg,
      protoPath: join(process.cwd(), protoPath),
      url,
    },
  };
};

export interface GrpcClientConfigOptions {
  name: string;
  package: string;
  protoPath: string;
  url: string;
}

export const getGrpcClientConfig = (options: GrpcClientConfigOptions): any => {
  const { name, package: pkg, protoPath, url } = options;
  
  return {
    name,
    transport: Transport.GRPC,
    options: {
      package: pkg,
      protoPath: join(process.cwd(), protoPath),
      url,
    },
  };
};

