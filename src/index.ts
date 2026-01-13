import { Elysia } from "elysia";
import { message } from "./modules/messages/message.route";
import { auth } from "./modules/auth/auth.route";

const App = new Elysia()
  .get("/", () => "Hello Elysia")
  .get("/about", () => "About Elysia")
  .use(auth)
  .use(message)

export default App;
// console.log(
//   `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`
// );
