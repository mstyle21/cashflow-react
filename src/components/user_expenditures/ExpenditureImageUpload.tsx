import { Box, Typography } from "@mui/material";
import React, { Dispatch, useContext, useRef, useState } from "react";
import { Form } from "react-bootstrap";
import { EIReducerAction, TExpenditureImage } from "./ExpenditureModal";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleXmark } from "@fortawesome/free-solid-svg-icons";
import { BACKEND_URL, randomHash } from "../../helpers/utils";
import axios from "axios";
import { AuthContext } from "../../context/AuthContext";

type ExpenditureImageUploadProps = {
  images: TExpenditureImage[] | [];
  dispatch: Dispatch<EIReducerAction>;
};

const ExpenditureImageUpload = ({ images, dispatch }: ExpenditureImageUploadProps) => {
  const [dragActive, setDragActive] = useState(false);
  const inputFile = useRef<HTMLInputElement>(null);
  const { user } = useContext(AuthContext);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleUploadedFiles(e.dataTransfer.files);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      handleUploadedFiles(e.target.files);
    }
  };

  const handleUploadedFiles = async (files: FileList) => {
    if (files.length > 0) {
      const filesArray: TExpenditureImage[] = [];
      for (let i = 0; i < files.length; i++) {
        const path = await previewImage(files[i]);
        if (path) {
          filesArray.push({
            hash: randomHash(),
            path: path,
            file: files[i],
          });
        }
      }

      dispatch({ type: "add_item", payload: filesArray });
    }
  };

  const previewImage = (file: File) => {
    return new Promise<string | null>((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        if (e.target && e.target.result) {
          resolve(e.target.result as string);
        }
      };
      reader.onerror = () => {
        reject(null);
      };
      reader.readAsDataURL(file);
    });
  };

  const handleRemoveImage = (image: TExpenditureImage) => {
    dispatch({ type: "delete_item", payload: image });
  };

  const handleDeleteImage = (image: TExpenditureImage) => {
    if (confirm("Are you sure you want to delete this image?")) {
      axios
        .delete(`${BACKEND_URL}/api/expenditures/image/${image.hash}`, {
          headers: { "x-access-token": user?.token ?? "missing-token" },
        })
        .then((response) => {
          if (response.status === 204) {
            handleRemoveImage(image);
          }
        })
        .catch((error) => {
          console.error(error);
        });
    }
  };

  return (
    <Box display="flex" flexDirection="column" gap="10px" sx={{ overflowY: "auto" }}>
      <Typography textAlign="center" fontWeight="bold" fontSize="24px">
        Upload images
      </Typography>
      <div
        className={`dragable-area ${dragActive ? "drag-active" : ""}`}
        onDrop={(e) => handleDrop(e)}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
      >
        Drag images or click{" "}
        <span
          onClick={() => {
            if (inputFile.current) {
              inputFile.current.click();
            }
          }}
          style={{ fontWeight: "bold", cursor: "pointer" }}
        >
          {" "}
          here{" "}
        </span>{" "}
        to upload.
        <Form.Control
          type="file"
          accept="image/jpeg, image/png"
          hidden
          ref={inputFile}
          multiple
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleInputChange(e)}
        />
      </div>
      <Box sx={{ overflowY: "auto" }}>
        {images.length > 0 &&
          images.map((image, index) => {
            if (image.expenditureId !== undefined) {
              return (
                <Box key={index} position="relative" mb="20px" border="1px solid lightgrey">
                  <FontAwesomeIcon
                    icon={faCircleXmark}
                    className="remove-image"
                    size="xl"
                    onClick={() => handleDeleteImage(image)}
                  />
                  <img
                    src={`${BACKEND_URL}/${image.expenditureId}/${image.path}`}
                    style={{ height: "auto", width: "100%", objectFit: "contain" }}
                  />
                </Box>
              );
            } else {
              return (
                <Box key={index} position="relative" mb="20px" border="1px solid lightgrey">
                  <FontAwesomeIcon
                    icon={faCircleXmark}
                    className="remove-image"
                    size="xl"
                    onClick={() => handleRemoveImage(image)}
                  />
                  <img src={image.path} style={{ height: "auto", width: "100%", objectFit: "contain" }} />
                </Box>
              );
            }
          })}
      </Box>
    </Box>
  );
};

export default ExpenditureImageUpload;
