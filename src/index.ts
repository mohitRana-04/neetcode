import express from "express";
import ffmpeg from "fluent-ffmpeg";

const app = express();
app.use(express.json());
app.post("/process-video", (req, res) => {
  //   get path of the input video file
  const inputVideoPath = req.body.inputFilePath;
  const outputVideoPath = req.body.outputFilePath;

  if (!inputVideoPath || !outputVideoPath) {
    res.status(400).send("Bad Request: Missing file path");
  }

  ffmpeg(inputVideoPath)
    .outputOptions("-vf", "scale=-1:360")
    .on("end", () => {
      res.status(200).send("Video Process Complete");
    })
    .on("error", (error) => {
      console.log(`An error occured: ${error.message}`);
      res.status(500).send(`Internal Server Error: ${error.message}`);
    })
    .save(outputVideoPath);
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Video processing is listening at http://localhost:${port}`);
});
