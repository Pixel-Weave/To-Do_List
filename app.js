//jshinteversion:6  


const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const _ = require("lodash");

const app = express();

app.set('view engine', 'ejs');


app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

main().catch(err => console.log(err));

async function main() {
    await mongoose.connect('mongodb+srv://admin-gaurang:Test123@cluster0.s2ierxq.mongodb.net/todolistDB');
}

const tasksSchema = new mongoose.Schema({
    name: String
});

const Task = mongoose.model("Task", tasksSchema);

const t1 = new Task({name: 'Welcome to your ToDo List.'});
const t2 = new Task({name: 'Hit the + button to add a new task.'});
const t3 = new Task({name: '<-- Hit this to delete an item.'});

const defaultTasks = [t1, t2, t3];

const listSchema = {
    name: String,
    items: [tasksSchema]
};

const List = mongoose.model("List", listSchema);

app.get("/", function(req, res) {
    
    Task.find({}).then(function(foundItems){

        if (foundItems.length == 0){
            Task.insertMany(defaultTasks).then(function(){
                console.log("Insertion successful!");
            }).catch(function(err){
                console.log(err);
            });

            res.redirect('/');
        } else {
            res.render("list", {listTitle: "Today", AddedTasks: foundItems});
        };
 
    }).catch(function(err){
        console.log(err);
    });
    
});

app.post("/", function (req, res) {

    const itemName = req.body.newTask;
    const listName = req.body.addTask;

    const newItem = new Task({name: itemName});

    if (listName == 'Today'){
        newItem.save();
        res.redirect('/');

    } else {
        List.findOne({name: listName}).then(function(foundList){
            foundList.items.push(newItem);
            foundList.save();
            res.redirect("/" + listName);
        });
    };
    

});

app.post("/delete", function(req, res){

    const checkedItemID = req.body.checkbox;
    const listName = req.body.listName;

    if (listName == "Today"){

        Task.deleteOne({_id: checkedItemID}).then(function(){
            console.log("Deleted Successfully.");
            res.redirect('/');
        }).catch(function(err){
            console.log(err);
        });

    } else {

        List.findOneAndUpdate({name: listName}, {$pull: {items: {_id: checkedItemID}}}).then(function(foundList){
            res.redirect("/" + listName);
        }).catch(function(err){
            console.log(err);
        });

    };
    

});

app.get("/:paramName", function(req, res){
    
    const customListName = _.capitalize(req.params.paramName);

    List.findOne({name: customListName}).then(function(foundList){

        if (!foundList){
            const list = new List({
                name: customListName,
                items: defaultTasks
            });

            list.save();

            res.redirect("/" + customListName);

        } else {

            res.render('list', {listTitle: foundList.name, AddedTasks: foundList.items});

        };

    }).catch(function(err){

        console.log(err);

    });

});

app.listen(3000, function () {
    console.log("The server started on port 3000");
});