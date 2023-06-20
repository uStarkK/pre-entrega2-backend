import express from "express";
import handlebars from "express-handlebars";
import path from "path";
import { cartRender } from "./routes/cartRender.js";
import { cartRouter } from "./routes/cart_router.js";
import { testChat } from "./routes/chat.router.js";
import { productsRender } from "./routes/ProductsRender.js";
import { productsRouter } from "./routes/products_router.js";
import { realTimeProducts } from "./routes/RealTimeProducts.js";
import { connectMongo, isAdmin, startSocket, __dirname } from "./utils.js";
import cookieParser from "cookie-parser"
import session from "express-session"
import MongoStore from "connect-mongo"
import { authRouter } from "./routes/auth.router.js";
// SERVER 
const PORT = 8080
const app = express()

const httpServer = app.listen(PORT, () => {console.log(`Server on! Listening on localhost:${PORT}`)})

connectMongo();
startSocket(httpServer)


app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));

app.use(session({
    store: MongoStore.create({mongoUrl: "mongodb+srv://Nahu22:nahu123@ecommerce.p4croqf.mongodb.net/", ttl: 5000, dbName: "ecommerce"}),
    secret: "un-re-secreto", 
    resave: true, 
    saveUninitialized: true}))



// Routes / Views
app.engine("handlebars", handlebars.engine());
app.set("views", path.join(__dirname, "views"))
app.set("view engine", "handlebars")


// API ROUTES
app.use("/api/products", productsRouter)
app.use("/api/carts", cartRouter)

// HTML RENDER
app.use("/products", productsRender)
app.use("/carts", cartRender)
app.use("/auth", authRouter)
// SOCKETS ROUTE
app.use("/realTimeProducts", isAdmin, realTimeProducts)
app.use("/chat", testChat)



app.get("*", (req, res, next) => {
    res.status(404).json({ status: "error", msg: "Route not found", data: {} })
})




