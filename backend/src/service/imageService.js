//
export const PostImage = async ({ file, title, description }) => {

    if (!file) {
        throw new Error("Image file is required.");

    }
    if (!title) {
        throw new Error("Title is required.");

    }
    if (!description) {
        throw new Error("Description is required.");
    }

    return { file, title, description };

}
//
export const GetImage = async () => {
    return {
        message: "data1 data2"
    }

}

