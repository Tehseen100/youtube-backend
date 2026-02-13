import ApiError from "../utils/ApiError.js";

const notFound = (req, res, next) => {
    const error = new ApiError(404, `Route ${req.originalUrl} not found`);
    next(error); // Pass it to the errorHandler
}

export default notFound;