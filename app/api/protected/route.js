import { csrf } from "../../lib/csrf";

const handler = (req, res) => {
    return res.status(200).json({ message: "This API route is protected." })
}

export default csrf(handler);



