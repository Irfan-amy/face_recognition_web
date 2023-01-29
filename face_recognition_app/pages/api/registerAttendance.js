import { StorageClient } from "@supabase/storage-js";
import { createClient } from "@supabase/supabase-js";
const fs = require("fs");

export default async (req, res) => {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
  );

  const { method } = req;

  switch (method) {
    case "POST":
      try {
        var { name, date, session, checkInTime, checkOutTime } = req.body;
        if (name && date && session) {
          const { data, error } = await supabase
            .from("Attendances")
            .select("*")
            .eq("name", name)
            .eq("date", date);
          console.log(data);

          if (error) {
            res.status(200).json({ error: error });
            return;
          }

          if (data.length == 0) {
            const { error } = await supabase
              .from("Attendances")
              .insert({ name: name, date: date });

            if (error) {
              res.status(200).json({ error: error });
              return;
            }
          }

          if (data[0].checkInTime && data[0].checkOutTime) {
            res.status(200).json({ error: "Already registered!" });
            return;
          }

          if (checkInTime) {
            var args = {};

            if (session == 1) {
              if (data[0].in1) {
                res.status(200).json({
                  error: "Already registered! (Check Out - Session 1)",
                });
                return;
              }
              args.in1 = checkInTime;
            } else if (session == 2) {
              if (data[0].in2) {
                res.status(200).json({
                  error: "Already registered! (Check Out - Session 2)",
                });
                return;
              }
              args.in2 = checkInTime;
            } else if (session == 3) {
              if (data[0].in3) {
                res.status(200).json({
                  error: "Already registered! (Check Out - Session 3)",
                });
                return;
              }
              args.in3 = checkInTime;
            }

            const { error } = await supabase
              .from("Attendances")
              .update(args)
              .eq("name", name)
              .eq("date", date);
            if (!error) {
              res.status(200).json({ error: error });
              return;
            } else {
              res.status(200).json({ success: true });
              return;
            }
          } else if (checkOutTime) {
            var args = {};

            if (session == 1) {
              if (data[0].out1) {
                res.status(200).json({
                  error: "Already registered! (Check Out - Session 1)",
                });
                return;
              }
              args.out1 = checkOutTime;
            } else if (session == 2) {
              if (data[0].out2) {
                res.status(200).json({
                  error: "Already registered! (Check Out - Session 2)",
                });
                return;
              }
              args.out2 = checkOutTime;
            } else if (session == 3) {
              if (data[0].out3) {
                res.status(200).json({
                  error: "Already registered! (Check Out - Session 3)",
                });
                return;
              }
              args.out3 = checkOutTime;
            }

            const { error } = await supabase
              .from("Attendances")
              .update({ checkOutTime: checkOutTime })
              .eq("name", name)
              .eq("date", date);
            if (!error) {
              res.status(200).json({ error: error });
              return;
            } else {
              res.status(200).json({ success: true });
              return;
            }
          } else res.status(200).json({ error: "unknown" });
        } else {
          console.log(name, date);
          res.status(200).json({ error: "Args not exists" });
        }
      } catch (error) {
        console.log(error);
        res.status(200).json({ error: "error" });
      }
      break;
    default:
      const { data, error } = await supabase
        .from("Attendances")
        .select("*")
        .eq("name", "test12")
        .eq("date", "test");

      console.log(data ?? error);
      res.status(200).json({ error: "Unknown" });
      break;
  }
};
