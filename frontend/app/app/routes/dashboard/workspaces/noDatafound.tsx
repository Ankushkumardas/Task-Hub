import React from 'react'
import { Button } from '~/components/ui/button';
type Data = {
    title: string;
    descritpion: string;
    buttontext: string;
    buttonAction: () => void;
};
const NoDataFound = ({ title, descritpion, buttontext, buttonAction }: Data) => {
  return (
    <div className="flex flex-col items-center justify-center  border p-4 rounded-md ">
      <h1 className="text-lg font-semibold mb-2">{title}</h1>
      <p className="mb-4 text-gray-600 text-center">{descritpion}</p>
      <Button
        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
        onClick={buttonAction}
      >
        {buttontext}
      </Button>
    </div>
  )
}

export default NoDataFound
