import { useState } from "react";
import { useEffect } from "react";
import image1Src from "./assets/test2.jpg";
import image2Src from "./assets/test3.jpg";
import cv from "@techstark/opencv-js";
import { styled } from "@mui/system";

const CenteredDiv = styled("div")({
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  height: "100vh",
});

function ImageComparison() {
  const [accuracy, setAccuracy] = useState<number | null>(null);

  useEffect(() => {
    const compareImages = async () => {
      try {
        const image1 = new Image();
        image1.src = image1Src;
        await image1.decode();
        const image2 = new Image();
        image2.src = image2Src;
        await image2.decode();

        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");

        if (!ctx) {
          throw new Error("2D context is null");
        }
        if (!cv) {
          throw new Error("cv is null");
        }

        canvas.width = image1.width;
        canvas.height = image1.height;

        ctx.drawImage(image1, 0, 0);
        const imageData1 = ctx.getImageData(0, 0, image1.width, image1.height);
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        ctx.drawImage(image2, 0, 0);
        const imageData2 = ctx.getImageData(0, 0, image2.width, image2.height);

        const mat1 = cv.matFromImageData(imageData1);
        const mat2 = cv.matFromImageData(imageData2);

        const diff = new cv.Mat();
        cv.absdiff(mat1, mat2, diff);

        let totalDiff = 0;
        for (let i = 0; i < diff.rows; i++) {
          for (let j = 0; j < diff.cols; j++) {
            totalDiff += diff.ucharPtr(i, j)[0];
          }
        }

        const numPixels = image1.width * image1.height;
        const calculatedAccuracy = 1 - totalDiff / (255 * numPixels);

        // Set the accuracy
        setAccuracy(calculatedAccuracy);

        // Clean up
        mat1.delete();
        mat2.delete();
        diff.delete();
      } catch (error) {
        console.error("Error comparing images:", error);
      }
    };

    compareImages();
  }, [cv]);

  return (
    <CenteredDiv>
      <h1>Image Comparison</h1>
      {accuracy !== null && (
        <p>The accuracy between the images is: {accuracy.toFixed(4)}</p>
      )}
    </CenteredDiv>
  );
}

export default ImageComparison;
