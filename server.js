import app from "./src/app.js";

const _PORT = process.env.PORT || 3000;

app.listen(_PORT, () => {
	console.log(`Server is running on port ${_PORT}`);
});
