import { StorageClient } from "@supabase/storage-js";
import { createClient } from "@supabase/supabase-js";
const fs = require("fs");

export default async (req, res) => {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
  );

  function dataURLtoFile(dataurl) {
    // const data = dataurl.replace(/^data:image\/\w+;base64,/, "");
    // const buf = Buffer.from(data, "base64");

    // const file = await fs.writeFile("imagea12312.jpg", buf);
    // console.log(file);
    // return buf;

    const imageBase64Str = dataurl.replace(/^.+,/, "");
    const buf = Buffer.from(imageBase64Str, "base64");
    // const file = fs.readFileSync("./image.png");
    // console.log(file);
    return buf;
  }
  console.log("done");
  const { method } = req;

  switch (method) {
    case "GET":
      try {
        const { data, error } = await supabase.from("Staff").select();
        if (!error) 
        res.status(200).json({ staffList: data.map((e) => e.name) });
        else
        res.status(400).json({ error: error.toString() });
      } catch (error) {
        res.status(400).json({ error: "Unknown" });
      }
      break;
    default:
      res.status(400).json({ error: "Unknown" });
      break;
  }
};
