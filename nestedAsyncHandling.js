const messages = {
    data :[
        {
            type: "text",
            body: "Hi"
        },
        {
            type: "media",
            media: function (){
                return new Promise((resolve, reject)=>{
                    resolve('http://xyz/images/1.jpg')
                })
            }
        },
        {
            type: "media",
            media: function (){
                return new Promise((resolve, reject)=>{
                    resolve('http://xyz/images/2.jpg')
                })
            }
        },
        {
            type: "text",
            body: "I have sent an images to you."
        },
        {
            type: "text",
            body: "Please have a look"
        },
        {
            type: "media",
            media: function (){
                return new Promise((resolve, reject)=>{
                    resolve('http://xyz/images/3.jpg')
                })
            }
        },
        {
            type: "media",
            media: function (){
                return new Promise((resolve, reject)=>{
                    resolve('http://xyz/images/4.jpg')
                })
            }
        }
    ]
};

function loadMessages(messages){
    return new Promise((loadResolve, loadReject)=> {
        let messagesMap = {}
        let messageMedia = {}

        let allCalls = []

        function asyncMethod (key, value) {
            return new Promise((ayncResolve,  asyncReject)=>{
                value().then(uri=>{
                    messagesMap[key] = {
                        type: 'media',
                        media: {
                            uri: uri
                        }
                    }
                    ayncResolve(true)
                })
            })
        }

        messages.forEach((message, i) => {
            messagesMap[i] = message
            if(message.type === 'media') {
                messagesMap[i] = ''
                messageMedia[i] = message.media
            }
        });

        for (const [key, value] of Object.entries(messageMedia)) {
            allCalls.push(asyncMethod(key, value))
        }

        Promise.all(allCalls).then(res=>{
            loadResolve(Object.values(messagesMap))
        }).catch(error=>{
            console.log('err: ', error);
        })
    })
}

function getMessages() {
    return new Promise((resolve, reject)=> {
        resolve(messages)
    })
}
getMessages()
    .then((messages)=> {
        console.log('messages: ', messages);
        return loadMessages(messages.data)
    })
    .then(result =>{
        console.log('result: ', result);
    }).catch(err=>{
        console.log('err: ', err);
    })