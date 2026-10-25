import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
const root=path.dirname(fileURLToPath(import.meta.url));
const types={'.html':'text/html','.svg':'image/svg+xml','.js':'text/javascript','.css':'text/css','.json':'application/json'};
const server=http.createServer((req,res)=>{let file;try{const url=new URL(req.url,'http://localhost');file=path.resolve(root,'.'+decodeURIComponent(url.pathname==='/'?'/index.html':url.pathname))}catch{res.writeHead(400).end();return}if(!file.startsWith(root+path.sep)||path.relative(root,file).split(path.sep).some(p=>p.startsWith('.'))){res.writeHead(403).end();return}fs.readFile(file,(err,data)=>{if(err){res.writeHead(404).end('Not found');return}res.writeHead(200,{'Content-Type':types[path.extname(file)]??'application/octet-stream','X-Content-Type-Options':'nosniff'});res.end(data)})});
server.listen(Number(process.env.PORT??5173),'127.0.0.1',()=>console.log(`Local: http://127.0.0.1:${server.address().port}`));
