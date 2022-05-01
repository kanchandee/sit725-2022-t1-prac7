const express = require("express");
const cors = require("cors");
const app = express();

const MongoClient = require("mongodb").MongoClient;
// Connect to the database
const uri = "mongodb+srv://admin:kanchan98765@cluster0.pakvj.mongodb.net/myFirstDatabase?retryWrites=true&w=majority"
const client = new MongoClient(uri, { useNewUrlParser: true });
let projectCollection;


let io = require('socket.io')(http);

io.on('connection', (socket) => {

  console.log('a user connected');

  socket.on('disconnect', () => {

    console.log('user disconnected');

  });

  setInterval(()=>{

    socket.emit('number', parseInt(Math.random()*10));

  }, 1000);


});



app.use(express.static(__dirname + '/public'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors());

const getProjects = (callback) => {
    projectCollection.find({}).toArray(callback);
};

const insertProject = (project, callback) => {
    projectCollection.insert(project, callback);
};

const createCollection = (collectionName) => {
    client.connect((err, db) => {
        projectCollection = client.db().collection(collectionName);
        if (!err) {
            console.log("Successfully created or acquired collection.");
        } else {
            console.error("Database error: " + err);
            process.exit(1);
        }
    });
};

const addNumbers = (number1, number2) => {
    var num1 = parseInt(number1)
    var num2 = parseInt(number2)
    var result = (num1 + num2) || null;
    return result;
}

app.get("/addTwoNumbers/:firstNumber/:secondNumber",(req,res) => {
    var number1 = req.params.firstNumber;
    var number2 = req.params.secondNumber;
    var result = addNumbers(number1,number2)
    if(result == null) {
        res.json({result: result, statusCode: 400}).status(400)
      }
      else { res.json({result: result, statusCode: 200}).status(200) } 
})


app.get('/api/projects', (req, res) => {
    getProjects((err, result) => {
        if (err) {
            res.json({ statusCode: 400, message: err });
        } else {
            res.json({ statusCode: 200, message: "Success", data: result });
        }
    });
});

app.post('/api/projects', (req, res) => {
    let project = req.body;
    insertProject(project, (err, result) => {
        if (err) {
            res.json({ statusCode: 400, message: err });
        } else {
            res.json({ statusCode: 200, message: "Successfully added new project", data: result });
        }
    });
});

const port = 3000;

app.listen(port, () => {
    console.log("App listening to: " + port);
    createCollection("pets");
});
