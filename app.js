//jshinteversion:6  


const express = require("express");
const bodyParser = require("body-parser");
const date = require(__dirname + "/date.js");

const app = express();

let tasks = [];
var workItems = [];


app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

app.set('view engine', 'ejs');

app.get("/", function(req, res) {
    
    let day = date.getDate();
    res.render("list", {listTitle: day, AddedTasks: tasks});
});

app.get("/work", function(req, res) {
    res.render("list", {listTitle: "Work List", AddedTasks: workItems});
});

app.post("/", function (req, res) {
    let task = req.body.newTask;
    
    if (req.body.addTask === "Work") {
        workItems.push(task);
        res.redirect("/work");
    } else {
        tasks.push(task);
        res.redirect("/");
    };

});

app.get("/about", function(req, res) {
    res.render("about");
});

app.listen(3000, function () {
    console.log("The server started on port 3000");
});