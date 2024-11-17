"use client";
import React, { useState, useCallback } from "react";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { useDropzone } from "react-dropzone";

const MyDropzone: React.FC = () => {
  const onDrop = useCallback((acceptedFiles: File[]) => {
    console.log(acceptedFiles);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  return (
    <div
      className="p-400px center br-8px"
      {...getRootProps()}
      style={{
        padding: "400px",
        textAlign: "center",
        borderRadius: "8px",
      }}
    >
      <div className="center-text">
        <input {...getInputProps()} />
        {isDragActive ? (
          <p>Drop the files here ...</p>
        ) : (
          <p className="display: flex; justify-content: center; align-items: center; height: 200px;">
            Drag 'n' drop some files here, or click to select files
          </p>
        )}
      </div>
    </div>
  );
};

const CreateAlbumPage: React.FC = () => {
  return (
    <div className="flex space-x-10 p-10">
      <div className="w-1/3 p-4">
        <h1 className="text-4xl font-bold mb-4">Upload Files</h1>
        <MyDropzone />
      </div>

      {/* Right Side - Create Album Form */}
      <div className="w-2/3 p-10 space-y-6">
        <h1 className="text-4xl font-bold">Create Album</h1>
        <hr className="w-full my-6" />

        <div>
          <h2 className="font-semibold">Album Title</h2>
          <Input
            placeholder="Add a title"
            className="text-md h-[50px] w-full"
          />
        </div>

        <div>
          <h2 className="font-semibold">Description</h2>
          <Input
            placeholder="Add a Description"
            className="text-md h-[200px] w-full"
          />
        </div>

        <div>
          <h2 className="font-semibold">Tags</h2>
          <Input placeholder="Add tags" className="text-md h-[50px] w-full" />
        </div>

        <div>
          <h2 className="font-semibold">Invite</h2>
          <div className="flex justify-between p-4">
            <button className="flex space-x-4">
              <Avatar>
                <AvatarImage src="https://github.com/shadcn.png" />
                <AvatarFallback>CN</AvatarFallback>
              </Avatar>
              <Avatar>
                <AvatarImage src="https://w7.pngwing.com/pngs/390/453/png-transparent-basic-add-new-create-plus-user-avatar-office-icon-thumbnail.png" />
                <AvatarFallback>CN</AvatarFallback>
              </Avatar>
            </button>
            <div className="flex justify-end">
              <Button className="bg-yellow-300">Publish</Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateAlbumPage;
