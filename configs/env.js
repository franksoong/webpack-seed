import path from 'path';


export const __dev__  = "development";
export const __prod__ = "production";

export const devPort  = 3000;
export const prodPort = 8080;

export const basePath = path.join(__dirname, '..', 'src');
export const outPath = path.join(__dirname, '..', 'out');

let env = {
    mode: "development",
    port: devPort,
    //others
};

//get from env
export function getEnv(key){
    return env[key];
};

//set to env
export default (config) => {
    Object.assign(env, config);

    //enhance node env
    Object.assign(process.env, env);
};