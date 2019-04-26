-- phpMyAdmin SQL Dump
-- version 4.7.4
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Nov 06, 2018 at 03:23 PM
-- Server version: 10.1.28-MariaDB
-- PHP Version: 7.1.10

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET AUTOCOMMIT = 0;
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `chat`
--

-- --------------------------------------------------------

--
-- Table structure for table `c0`
--

CREATE TABLE `c0` (
  `id` int(11) NOT NULL,
  `name` varchar(255) DEFAULT NULL,
  `msg` varchar(255) DEFAULT NULL,
  `date` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `c42`
--

CREATE TABLE `c42` (
  `id` int(11) NOT NULL,
  `name` varchar(255) DEFAULT NULL,
  `msg` varchar(255) DEFAULT NULL,
  `date` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `c43`
--

CREATE TABLE `c43` (
  `id` int(11) NOT NULL,
  `name` varchar(255) DEFAULT NULL,
  `msg` varchar(255) DEFAULT NULL,
  `date` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `c43`
--

INSERT INTO `c43` (`id`, `name`, `msg`, `date`) VALUES
(0, 'Kamalludin Nazari', 'hello world', '2018-11-06 13:23:47');

-- --------------------------------------------------------

--
-- Table structure for table `c44`
--

CREATE TABLE `c44` (
  `id` int(11) NOT NULL,
  `name` varchar(255) DEFAULT NULL,
  `msg` varchar(255) DEFAULT NULL,
  `date` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `c44`
--

INSERT INTO `c44` (`id`, `name`, `msg`, `date`) VALUES
(1, 'Kamalludin Nazari', 'Hello world', '2018-11-06 14:02:05'),
(2, 'Kamalludin Nazari', 'This is another one', '2018-11-06 14:02:10'),
(3, 'Kamalludin Nazari', 'Holla ', '2018-11-06 14:02:15'),
(4, 'Kamalludin Nazari', 'adsf', '2018-11-06 14:03:21'),
(5, 'Kamalludin Nazari', 'hgsdf', '2018-11-06 14:03:24');

-- --------------------------------------------------------

--
-- Table structure for table `c45`
--

CREATE TABLE `c45` (
  `id` int(11) NOT NULL,
  `name` varchar(255) DEFAULT NULL,
  `msg` varchar(255) DEFAULT NULL,
  `date` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `c45`
--

INSERT INTO `c45` (`id`, `name`, `msg`, `date`) VALUES
(1, 'Kamalludin Nazari', 'Hi everyone', '2018-11-06 14:07:54');

-- --------------------------------------------------------

--
-- Table structure for table `c46`
--

CREATE TABLE `c46` (
  `id` int(11) NOT NULL,
  `name` varchar(255) DEFAULT NULL,
  `msg` varchar(255) DEFAULT NULL,
  `date` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `c46`
--

INSERT INTO `c46` (`id`, `name`, `msg`, `date`) VALUES
(1, 'Kamalludin Nazari', 'Hi I am new developer in JQuery Please help me ', '2018-11-06 14:09:12');

-- --------------------------------------------------------

--
-- Table structure for table `c47`
--

CREATE TABLE `c47` (
  `id` int(11) NOT NULL,
  `name` varchar(255) DEFAULT NULL,
  `msg` varchar(255) DEFAULT NULL,
  `date` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `c48`
--

CREATE TABLE `c48` (
  `id` int(11) NOT NULL,
  `name` varchar(255) DEFAULT NULL,
  `msg` varchar(255) DEFAULT NULL,
  `date` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `c49`
--

CREATE TABLE `c49` (
  `id` int(11) NOT NULL,
  `name` varchar(255) DEFAULT NULL,
  `msg` varchar(255) DEFAULT NULL,
  `date` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `c49`
--

INSERT INTO `c49` (`id`, `name`, `msg`, `date`) VALUES
(1, 'Kamalludin Nazari', 'Hi I am a new programmer in Go, I need some help', '2018-11-06 14:13:45');

-- --------------------------------------------------------

--
-- Table structure for table `c50`
--

CREATE TABLE `c50` (
  `id` int(11) NOT NULL,
  `name` varchar(255) DEFAULT NULL,
  `msg` varchar(255) DEFAULT NULL,
  `date` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `c51`
--

CREATE TABLE `c51` (
  `id` int(11) NOT NULL,
  `name` varchar(255) DEFAULT NULL,
  `msg` varchar(255) DEFAULT NULL,
  `date` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `c52`
--

CREATE TABLE `c52` (
  `id` int(11) NOT NULL,
  `name` varchar(255) DEFAULT NULL,
  `msg` varchar(255) DEFAULT NULL,
  `date` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `chat_info`
--

CREATE TABLE `chat_info` (
  `id` int(11) NOT NULL,
  `name` varchar(255) DEFAULT NULL,
  `msg` varchar(255) DEFAULT NULL,
  `date` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Indexes for dumped tables
--

--
-- Indexes for table `c0`
--
ALTER TABLE `c0`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `c42`
--
ALTER TABLE `c42`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `c43`
--
ALTER TABLE `c43`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `c44`
--
ALTER TABLE `c44`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `c45`
--
ALTER TABLE `c45`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `c46`
--
ALTER TABLE `c46`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `c47`
--
ALTER TABLE `c47`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `c48`
--
ALTER TABLE `c48`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `c49`
--
ALTER TABLE `c49`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `c50`
--
ALTER TABLE `c50`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `c51`
--
ALTER TABLE `c51`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `c52`
--
ALTER TABLE `c52`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `chat_info`
--
ALTER TABLE `chat_info`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `c44`
--
ALTER TABLE `c44`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `c45`
--
ALTER TABLE `c45`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `c46`
--
ALTER TABLE `c46`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `c47`
--
ALTER TABLE `c47`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `c48`
--
ALTER TABLE `c48`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `c49`
--
ALTER TABLE `c49`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `c50`
--
ALTER TABLE `c50`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `c51`
--
ALTER TABLE `c51`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `c52`
--
ALTER TABLE `c52`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
