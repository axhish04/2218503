const express = require("express");
const app = express();
const urlRoutes = require("./routes/urlRoutes");

app.use(express.json()); // Body parser
app.use("/", urlRoutes);

const PORT = 5000;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
