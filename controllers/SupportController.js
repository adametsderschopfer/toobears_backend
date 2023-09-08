import { sendSupport } from "../mailer/support.js";

export const send = async (req, res) => {
	sendSupport(req.body.name, req.body.email, req.body.message)
	
    return (res.json({ ok: true }))
}