-- phpMyAdmin SQL Dump
-- version 5.1.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Jun 20, 2024 at 03:14 PM
-- Server version: 10.4.20-MariaDB
-- PHP Version: 8.0.9

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `delifast`
--

-- --------------------------------------------------------

--
-- Table structure for table `favorites`
--

CREATE TABLE `favorites` (
  `id` int(11) NOT NULL,
  `userId` int(11) DEFAULT NULL,
  `recipeId` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `favorites`
--

INSERT INTO `favorites` (`id`, `userId`, `recipeId`) VALUES
(2, 2, 715415),
(3, 2, 716406),
(4, 2, 715415),
(5, 2, 644387),
(6, 2, 644387),
(7, 2, 715446),
(8, 2, 715495),
(9, 2, 716406),
(10, 2, 716426),
(11, 2, 782601),
(12, 2, 716004);

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `username` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `createdAt` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `username`, `email`, `password`, `createdAt`) VALUES
(1, 'raisha', 'biancacaca489@gmail.com', 'jakarta', '2024-06-17 04:29:43'),
(2, 'bianca', 'biancacaca123@gmail.com', '$2b$10$EhAyJdRym2JSYTiNl6CLq.3pL4dGfvY3NnkiexRhZa9UXyDjz.Hnu', '2024-06-19 20:43:53'),
(3, '2110511077', 'biancacaca22@gmail.com', '$2b$10$Wyl.2oqVUo3wytc/mrGGAekJ17XDsZGdjQNRRCUKD1NT5OHQP8eK2', '2024-06-20 02:26:08'),
(8, '2110511078', 'biancacaca33@gmail.com', '$2b$10$Km/ejUD.PBYEp2mVyT8tvOiJxYsaFHAoPzexNNhDxIBAgPV6GuQS6', '2024-06-20 02:30:42'),
(9, '21', 'biancacaca@gmail.com', '$2b$10$1WP8Ah.kA7Sa21k2775KKeXImnKRu539d4IZ4snLL8UC6XLVAbNFi', '2024-06-20 12:56:58');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `favorites`
--
ALTER TABLE `favorites`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user` (`userId`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `username` (`username`),
  ADD UNIQUE KEY `email` (`email`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `favorites`
--
ALTER TABLE `favorites`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=13;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `favorites`
--
ALTER TABLE `favorites`
  ADD CONSTRAINT `user` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE SET NULL;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
