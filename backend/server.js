// express
const express = require('express');
const app = express();

// socket.io
const socket = require('socket.io');
const port = 8080;

server = app.listen(port, function(){
    console.log('server is running on port ',port)
});

io = socket(server);

var username = "default"

// firebase 
const admin = require('firebase-admin');
var serviceAccount = require('/Users/nomaking/workspace/service_key/ppute-b271b-1bc93df86d6e.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

var db = admin.firestore();

// const variables
const EXIST = 1;
const NOT_EXIST = 0;
const ERROR = -1;

// db initialize
function init_db(ip){
    var doc_ref = db.collection('users').doc(ip);

    var set_ada = doc_ref.set({
        nickname : 'default',
        win : 0,
        lose : 0,
    })

    console.log('Create new account : ', ip);
}

// find userinfo data in DB by ip
// If userinfo is already existed in db, return userinfo
// If not, initialize db and then return userinfo
async function find_db(ip){
    var data = 'default data';
    
    var doc_ref = db.collection('users').doc(ip);
    var get_doc = await doc_ref.get()
        .then(doc =>{
            if(!doc.exists){
                init_db(ip);
                data = find_db(ip);
            }
            else{
                data = doc.data();
            }
        })
        .catch(err => {
            console.log('Error getting document', err);
        });

    return data;
}

function update_db(ip,field,value){
    var doc_ref = db.collection('users').doc(ip);
    
    if(field === 'nickname'){
        doc_ref.update({
            nickname : value
        })
    }
    else if(field === 'win'){
        doc_ref.update({
            win : value
        })
    }
    else if(field === 'lose'){
        doc_ref.update({
            lose : value
        })
    }
    else{
        console.log('[update_db] ERROR')
    }
} 

function is_number(value){
    if(typeof value === "number") return true
    else return false
}

// When client connected
io.on('connection', async (socket)=> {
    var client_ip = socket.request.connection.remoteAddress;
    client_ip = client_ip.split(":")[3]

    console.log('User connected : ', client_ip)

    // get user info from db
    // console.log('Getting userinfo')
    var userinfo = await find_db(client_ip);

    // send client ip
    io.emit('RECEIVE_IP', client_ip);

    // send user info 
    io.emit('RECEIVE_USERINFO', userinfo);
    io.emit('RECEIVE_USERWIN', userinfo.win);
    io.emit('RECIEVE_USERLOSE', userinfo.lose);

    // Username이 바뀌었을때
    socket.on('CHANGE_USERNAME', function(data){
        username = data.username
        update_db(client_ip, 'nickname', username)

        console.log("[CHANGE_USERNAME] change username : ",username)
    })
})


