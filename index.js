import http from "http";
// import name from './features.js';
// import {mname,lname} from './features.js';
import * as myObj from './features.js';
import Sucess from "./features.js";
console.log(myObj);
import fs from 'fs';
//Async code so it would let hte sync work first then
// const Home = fs.readFile('./index.html',()=>{
//     console.log('File Read')
// });
// console.log(Home);
// by sync we can fix this undefined problem beacuse after read of 
// the file only it will proceed further
const home = fs.readFileSync('./index.html');
const server = http.createServer((req,res) =>{
    console.log(req.url)
    if(req.url === '/' ){
        // res.end(`<h3>Sucess Perctage is ${Sucess}</h3>`)
        // fs.readFile('./index.html',(error,data)=>{
        //     res.end(data);
        // })
        console.log(req.method);
        /*Four methods in req.method 
        post -> Create data
        get -> Read  data
        delete -> Delete data
        Put ->  Update data*/
        res.end(home);
    }
    else if(req.url === '/about'){
        res.end(Sucess())
    }
    else if(req.url === '/contact'){
        res.end("<h3> Contact Page </h3>")
    }else{
        res.end("Page not found 404!!")
    }
})
/*module is nothing but its a function  in nodejs
*/
server.listen(8000,() =>{
    console.log('Server is Created')
})

