import express from "express";
const app = express();
const port = 8000;

app.use(express.static("dist"));
app.use("/tests", express.static("cypress/public"));

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}/`);
});
