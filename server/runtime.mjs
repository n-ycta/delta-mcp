import{readFile}from'node:fs/promises';
import{DeltaClient,DeltaError,servePlugin}from'./delta-sdk.mjs';
export async function runtime(setup){
 const client=new DeltaClient(),controller=new AbortController();
 const info=await client.call('core.info');
 const v=String(info.version||'').split('.').map(Number);
 if(v[0]!==0||v[1]!==4||v[2]<3)throw new DeltaError('incompatible_core','Delta Core >=0.4.3 <0.5.0 required');
 const manifest=JSON.parse(await readFile(new URL('../manifest.json',import.meta.url)));
 const{handlers,stop=()=>{}}=await setup(client);
 for(const s of['SIGINT','SIGTERM'])process.once(s,()=>controller.abort());
 try{await servePlugin(client,manifest,handlers,{signal:controller.signal})}finally{await stop()}
}
export function owner(c){if(!c?.scopes?.includes('admin'))throw new DeltaError('forbidden','Owner access required')}
