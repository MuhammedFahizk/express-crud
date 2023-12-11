const express = require("express");
const fs = require("fs");
const bodyParser = require("body-parser");
const { v4: uuidv4 } = require("uuid");
const path = require("path");
const { error } = require("console");

const app = express();
const port = 3000;

app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

const indexpage = fs.readFileSync("views/index.ejs", "utf-8");
const userDataPath = "Data/userdata.json";
const formpage = fs.readFileSync("enterform.html", "utf-8");
const datajson = JSON.parse(fs.readFileSync(userDataPath, "utf-8"));

app.get("/", (req, res) => {
    try {
        const datafile = fs.readFileSync(userDataPath, "utf-8");
        let existdata = JSON.parse(datafile);

        res.render("update", { users: existdata });

        fs.readFileSync("views/update.ejs", "utf-8", (err, data) => {
            res.render("index", { content: data });
            res.send(indexpage);
        });
    } catch (error) {
        console.error(error);
        res.status(500).send("Internal Server Error");
    }
});
app.get("/form", (req, res) => {
    res.status(200).send(formpage);
});

app.post("/myform", (req, res) => {
    try {
        const formdata = req.body;
        const id = uuidv4();
        console.log(formdata)
        formdata.number=`${formdata.code}+${formdata.number}`
        formdata.id = id;
        formdata.eid = id;

        let existdata = [];

        if (fs.existsSync(userDataPath)) {
            const datafile = fs.readFileSync(userDataPath, "utf-8");
            existdata = JSON.parse(datafile);
        }

        existdata.push(formdata);
        fs.writeFileSync(userDataPath, JSON.stringify(existdata, null, 2));

        res.status(200).send(formpage);
    } catch (error) {
        console.error(error);
        res.status(500).send("Internal Server Error");
    }
});
app.get("/home", (req, res) => {
    try {
        const datafile = fs.readFileSync(userDataPath, "utf-8");
        let existdata = JSON.parse(datafile);

        res.render("update", { users: existdata });

        fs.readFileSync("views/update.ejs", "utf-8", (err, data) => {
            res.render("index", { content: data });
            res.send(indexpage);
        });
    } catch (error) {
        console.error(error);
        res.status(500).send("Internal Server Error");
    }
});
app.delete("/deleteItem/:itemId", async (req, res) => {
    const id = req.params.itemId;
    try {
        // Read the JSON data from file
        const datauser = fs.readFileSync("Data/userdata.json", "utf-8");
        let deletevalu = JSON.parse(datauser);

        // Remove the element with the specified id from deletevalu
        deletevalu = deletevalu.filter((a) => a.id != id);
        console.log(deletevalu);

        // Write the updated data back to file
        fs.writeFileSync(
            "Data/userdata.json",
            JSON.stringify(deletevalu, null, 2),
            "utf-8"
        );
        res.send(indexpage);
    } catch (err) {
        console.error(err);
        res.status(500).send("Internal Server Error");
    }
});
app.get("/edit/:itemid", (req, res) => {
    const id = req.params.itemid;
    const datauser = fs.readFileSync("Data/userdata.json", "utf-8");
    let deletevalu = JSON.parse(datauser);
    deletevalu = deletevalu.find((a) => a.id === id);

    try {
        let phoneNumber = deletevalu.number.replace(/\D/g, ''); // Remove non-digit characters
let countryCode = deletevalu.code;
let phoneNumberWithoutCountryCode = phoneNumber.replace(new RegExp(`^${countryCode}`), '');

        res.render("form", {
            name: deletevalu.name,
            age: deletevalu.age,
            number:phoneNumberWithoutCountryCode,
            email: deletevalu.email,
            id: deletevalu.id,
            code: deletevalu.code,

        });

        const editpage = fs.readFile("views/form.ejs", "utf-8");
        res.send(editpage);
    } catch { }
});

app.patch("/updateitem/:itemId", (req, res) => {
    const id = req.params.itemId;
    console.log(req.body); 

    let formdata = [];
    formdata = req.body;
    formdata.number=`${formdata.code}+${formdata.number}`

    console.log(formdata);

    try {
        const datauser = fs.readFileSync("Data/userdata.json", "utf-8");

        let editjson = [];
        editjson = JSON.parse(datauser);

        const editIndex = editjson.findIndex((item) => item.id === id);


        if (editIndex !== -1) {

            editjson[editIndex] = { ...editjson[editIndex], ...formdata };

            fs.writeFileSync(
                "Data/userdata.json",
                JSON.stringify(editjson, null, 2),
                "utf-8"
            );

            res.status(200).json({ message: "Item updated successfully" });
        } else {
            res.status(404).json({ message: "Item not found" });
        }
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Internal Server Error" });
    }
    res.redirect("/home");
});




app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});
