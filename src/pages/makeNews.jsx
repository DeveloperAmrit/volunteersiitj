import React, { useState } from 'react';
import { nanoid } from 'nanoid';
import { useUserContext } from '../customHooks/UserContext';

const MakeNews = () => {
  const [image,setImage] = useState(null);
  const [news, setNews] = useState({
    imageURL: '',
    heading: '',
    firstParagraph: '',
    secondParagraph: '',
  });

  const [showSecondParagraph, setShowSecondParagraph] = useState(false);
  const [preview, setPreview] = useState(null); // To store the preview URL

  const user = useUserContext();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNews({ ...news, [name]: value });
  };

  const toggleSecondParagraph = () => {
    if (showSecondParagraph) {
      setNews({ ...news, secondParagraph: '' })
    }
    setShowSecondParagraph(!showSecondParagraph);
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      setImage(file);
      setPreview(URL.createObjectURL(file));
    }
  }

  const handlePublish = () => {
    const uniqueId = nanoid();

    async function publishToDatabase() {

      let imageURLFinal='';
      // Uploading image
      if (image) {
        console.log("Uploading image...");
      
        const formData = new FormData();
        formData.append('image', image); // Append the image file to FormData
        formData.append('filename', uniqueId); // Append the filename
      
        try {
          const response1 = await fetch("http://localhost:5000/upload", {
            method: 'POST',
            body: formData, // Send form data instead of JSON
          });
      
          const data1 = await response1.json();
          const imageURL = data1.url;
          imageURLFinal = imageURL;
          console.log(imageURLFinal);
      
        } catch (error) {
          return;
        }
      }


      // Creating news in DB
      const response2 = await fetch("http://localhost:5000/createNews", {
        method: 'POST',
        headers: {
          "Content-Type": "application/json", // Content type of the request body
        },
        body: JSON.stringify({
          title: news.heading,
          newsId: uniqueId,
          imageURL: imageURLFinal,
          para1: news.firstParagraph,
          para2: news.secondParagraph,
          creator: user.name,
          creatorId: user.userId
        })
      })

      const data2 = await response2.json();


      // Updating user in DB
      const response3 = await fetch("http://localhost:5000/modifyUser",{
        method: 'POST',
        headers: {
          "Content-Type": "application/json", // Content type of the request body
        },
        body: JSON.stringify({
          userId: user.userId,
          updates: {
            madeNews: [...user.madeNews,{id: `news${uniqueId}`}]
          }
        })
      })
      const data3 = await response3.json();
      console.log(data3.message);
    }
    publishToDatabase();
  }

  return (
    <div className="mt-[50px] min-h-screen bg-gray-50 dark:bg-gray-900 py-10 px-4 flex flex-col items-center">
      <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-200 mb-6">
        Create News
      </h1>
      <form
        className="w-full max-w-lg bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6"
        onSubmit={(e) => e.preventDefault()}
      >
        <div className="mb-4">
          <div>
            <div className="flex flex-col items-center space-y-4">
              {/* Styled Input Box */}
              <label
                className="w-full h-60 bg-no-repeat bg-contain bg-center border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center bg-gray-100 cursor-pointer relative"
                htmlFor="fileInput"
                style={{
                  backgroundImage: `url(${(preview) ? preview : '/assets/images/uploadImg.png'})`,
                }}
              >{!preview &&
                <span className="text-gray-500 text-center">
                  Click to upload or drag and drop your image here
                </span>}
                <input
                  id="fileInput"
                  type="file"
                  accept="image/*"
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  onChange={handleFileChange}
                />
              </label>
            </div>
          </div>
        </div>

        <div className="mb-4">
          <label
            htmlFor="heading"
            className="block text-gray-700 dark:text-gray-300 font-medium mb-2"
          >
            Heading
          </label>
          <input
            type="text"
            id="heading"
            name="heading"
            placeholder="Enter news heading"
            value={news.heading}
            required
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded-lg text-gray-700 dark:text-gray-300 bg-gray-50 dark:bg-gray-900 border-gray-300 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
        </div>

        <div className="mb-4">
          <label
            htmlFor="firstParagraph"
            className="block text-gray-700 dark:text-gray-300 font-medium mb-2"
          >
            First Paragraph
          </label>
          <textarea
            id="firstParagraph"
            name="firstParagraph"
            placeholder="Write a descriptive paragraph..."
            value={news.firstParagraph}
            onChange={handleChange}
            rows="5"
            required
            className="w-full px-3 py-2 border rounded-lg text-gray-700 dark:text-gray-300 bg-gray-50 dark:bg-gray-900 border-gray-300 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-500"
          ></textarea>
        </div>

        <button
          type="button"
          onClick={toggleSecondParagraph}
          className="mb-4 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transform transition-all duration-300 hover:scale-105 active:scale-95 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          {showSecondParagraph ? 'Remove Second Paragraph' : 'Add Second Paragraph'}
        </button>

        {showSecondParagraph && (
          <div className="mb-4">
            <label
              htmlFor="secondParagraph"
              className="block text-gray-700 dark:text-gray-300 font-medium mb-2"
            >
              Second Paragraph
            </label>
            <textarea
              id="secondParagraph"
              name="secondParagraph"
              placeholder="Write an optional second paragraph..."
              value={news.secondParagraph}
              onChange={handleChange}
              rows="5"
              className="w-full px-3 py-2 border rounded-lg text-gray-700 dark:text-gray-300 bg-gray-50 dark:bg-gray-900 border-gray-300 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-500"
            ></textarea>
          </div>
        )}

        <button
          type="submit"
          onClick={handlePublish}
          className="w-full py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transform transition-all duration-300 hover:scale-105 active:scale-95 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2"
        >
          Publish News
        </button>
      </form>

      {(news.heading || news.firstParagraph || news.image || news.secondParagraph) && (
        <div className="w-full max-w-lg mt-10 bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
          <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200 mb-4">
            Preview
          </h2>
          {preview && (
            <img
              src={preview}
              alt="News"
              className="w-full max-w-md max-h-60 object-contain mb-4"
            />
          )}
          {news.heading && (
            <h3 className="text-xl font-semibold text-gray-700 text-center dark:text-gray-300 mb-2">
              {news.heading}
            </h3>
          )}
          {news.firstParagraph && (
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              {news.firstParagraph}
            </p>
          )}
          {news.secondParagraph && (
            <p className="text-gray-600 dark:text-gray-400">
              {news.secondParagraph}
            </p>
          )}
        </div>
      )}
    </div>
  );
};

export default MakeNews;
