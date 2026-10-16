import{createServer}from'node:http';import{resolve,join}from'node:path';
import{mkdir,rename,access,stat,chmod}from'node:fs/promises';
import{createMcp}from'./mcp.mjs';import{runtime}from'./runtime.mjs';
export async function migrateProfiles(client,home,dir){
 const source=join(process.env.DELTA_LEGACY_WEB_DATA||join(home,'data','web'),'mcp.json'),dest=join(dir,'profiles.json');
 await mkdir(dir,{recursive:true,mode:0o700});await chmod(dir,0o700);
 let sourceExists=false;try{await access(source);sourceExists=true}catch(e){if(e.code!=='ENOENT')throw e}
 if(!sourceExists)return;
 const web=(await client.call('core.components')).find(c=>c.id==='web');
 if(web&&/^0\.[0-5]\.|^0\.6\.[0-5]$/.test(web.version||''))throw Error('Stop or upgrade legacy Web before migrating MCP profiles');
 try{await access(dest);throw Error('Both legacy and new MCP profiles exist; explicit migration required')}catch(e){if(e.code!=='ENOENT')throw e}
 if(!(await stat(source)).isFile())throw Error('Invalid MCP profile migration source');
 await chmod(source,0o600);await rename(source,dest);
}
export async function startMcp(client){
 const home=process.env.DELTA_HOME;if(!home)throw Error('DELTA_HOME required');
 const dir=resolve(process.env.DATA_DIR||join(home,'data','mcp'));await migrateProfiles(client,home,dir);
 const mcp=await createMcp(client,join(dir,'profiles.json'));
 const host=process.env.HOST||'127.0.0.1',port=Number(process.env.PORT||7730);
 if(!['127.0.0.1','::1','localhost'].includes(host)&&!process.env.PUBLIC_ORIGIN?.startsWith('https://'))throw Error('Remote MCP requires an explicit HTTPS PUBLIC_ORIGIN');
 const server=createServer((req,res)=>{const path=new URL(req.url,'http://localhost').pathname;if(!path.startsWith('/mcp/')){res.writeHead(404);res.end();return}void mcp.http(req,res,path).catch(()=>{if(!res.headersSent)res.writeHead(503);res.end()})});
 await new Promise((ok,fail)=>{server.once('error',fail);server.listen(port,host,ok)});
 return{handlers:{...mcp.handlers,'mcp.info':async()=>({version:'0.1.2',transport:'streamable-http',listen:{host,port:server.address().port},path:'/mcp/:id'})},stop:()=>new Promise(ok=>{server.close(ok);server.closeAllConnections()})};
}
if(process.env.DELTA_COMPONENT_ID==='mcp'||process.argv[1]&&import.meta.url===(await import('node:url')).pathToFileURL(process.argv[1]).href)await runtime(startMcp);
