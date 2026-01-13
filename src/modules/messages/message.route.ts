import { Elysia } from "elysia";
import { MessageController } from "./messages.controller";
import { MessageCreateModels } from "./messages.model";

export const message = new Elysia({prefix: '/messages'})
    .get("/", async () => {
        const res = await MessageController.getMessages();
        return res
    })
    .post("/", async(ctx) => {
        const { body, set } = ctx
        const res = await MessageController.addMessage(body)
        set.status = 201
        return res
    }, {
        body: MessageCreateModels
    })