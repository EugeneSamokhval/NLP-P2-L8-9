from fastapi import FastAPI, HTTPException, File, UploadFile
from fastapi.responses import JSONResponse, FileResponse
from fastapi.staticfiles import StaticFiles
from fastapi.middleware.cors import CORSMiddleware
from nltk import word_tokenize
from nltk.corpus import stopwords
from string import punctuation
import nltk
import json
import logging
import os


nltk.download("stopwords")
stop_words = set(stopwords.words("english"))
for sign in punctuation:
    stop_words.add(sign)

logging.basicConfig(
    level=logging.INFO,  # Set the log level
    # Set the log format
    format="%(asctime)s - %(name)s - %(levelname)s - %(message)s",
    handlers=[
        logging.FileHandler("fastapi.log"),  # Log to a file
        logging.StreamHandler()  # Log to the console
    ]
)

logger = logging.getLogger(__name__)

with open("./src/config.json", "r") as config_file:
    config = json.load(config_file)

app = FastAPI()

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"]
)

# Mount static files
app.mount(
    "/static", StaticFiles(directory=os.getcwd().removesuffix('\\src') + '\\'), name="static"
)


@app.get("/", response_class=FileResponse)
async def read_index():
    response = FileResponse(os.getcwd().removesuffix(
        '\\src') + "\\static\\index.html")
    response.headers["Cache-Control"] = "no-cache, no-store, must-revalidate"
    response.headers["Pragma"] = "no-cache"
    response.headers["Expires"] = "0"
    return response


@app.get("/command", response_class=JSONResponse)
async def choose_command(command: str):
    words = word_tokenize(command)
    words = [word.lower() for word in words if word.lower() not in stop_words]
    command = words.pop(0)
    return JSONResponse(content={"command": command, "pointer": words})

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app="main:app",
                host=config["host"], port=config["port"], reload=True)
