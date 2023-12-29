const router = require("express").Router();

const {
  createUser,
  getUsers,
  getUserById,
  updateUser,
  updateAvatar,
} = require("../controllers/users");

// РОУТЕРЫ
router.get("/users", getUsers); // возвращает всех пользователей
router.get("/users/:userId", getUserById); // возвращает пользователя по _id
router.post("/users", createUser); // создаёт пользователя
router.patch("/users/me", updateUser); // Ообновляет профиль
router.patch("/users/me/avatar", updateAvatar); // Обновляет аватар

module.exports = router;
