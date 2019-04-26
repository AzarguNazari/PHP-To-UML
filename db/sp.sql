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
-- Database: `sp`
--

-- --------------------------------------------------------

--
-- Table structure for table `communities`
--

CREATE TABLE `communities` (
  `c_id` int(10) NOT NULL,
  `c_name` varchar(50) NOT NULL,
  `c_catagory` varchar(50) DEFAULT NULL,
  `c_creator` varchar(50) NOT NULL,
  `c_about` varchar(1000) DEFAULT 'No Information',
  `c_participants` int(10) NOT NULL DEFAULT '0',
  `c_opensource` varchar(3) DEFAULT NULL,
  `c_link` varchar(200) DEFAULT NULL,
  `c_image` blob
) ENGINE=MyISAM DEFAULT CHARSET=latin1;

--
-- Dumping data for table `communities`
--

INSERT INTO `communities` (`c_id`, `c_name`, `c_catagory`, `c_creator`, `c_about`, `c_participants`, `c_opensource`, `c_link`, `c_image`) VALUES
(48, 'JavaScript', 'Language', 'Kamalludin Nazari', 'JavaScript, often abbreviated as JS, is a high-level, interpreted programming language.', 0, 'no', '', NULL),
(49, 'Go', 'Language', 'Kamalludin Nazari', 'Go is a programming language designed by Google engineers Robert Griesemer, Rob Pike, and Ken Thompson.', 0, 'yes', 'https://opensource.com/article/17/11/why-go-grows', NULL),
(50, 'C', 'Language', 'Kamalludin Nazari', 'C is a general-purpose, imperative computer programming language, supporting structured programming', 0, 'no', '', NULL),
(51, 'Python', 'Language', 'Kamalludin Nazari', 'Python is an interpreted high-level programming language for general-purpose programming.', 0, 'yes', 'https://www.python.org/downloads/source/', NULL),
(52, 'React', 'Library', 'Kamalludin Nazari', 'In computing, React is a JavaScript library for building user interfaces. It is maintained by Facebook.', 0, 'yes', 'https://github.com/facebook/react', NULL),
(47, 'PHP', 'Language', 'Kamalludin Nazari', 'PHP is a language for creating interactive web sites and is used on over 3.3 million web sites around the world.', 0, 'yes', 'https://github.com/php/php-src', NULL),
(46, 'jQuery', 'Library', 'Kamalludin Nazari', 'jQuery is a JavaScript library designed to simplify the client-side scripting of HTML. It is free, open-source software using the permissive MIT License.', 0, 'yes', 'https://github.com/jquery/jquery', NULL),
(45, 'Java', 'Language', 'Kamalludin Nazari', 'Java is a general-purpose computer-programming language that is concurrent, class-based, object-oriented, and specifically designed to have as few implementation dependencies as possible.', 0, 'yes', 'https://java-source.net/', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `likedcommunity`
--

CREATE TABLE `likedcommunity` (
  `user_id` int(10) NOT NULL,
  `c_id` int(10) NOT NULL
) ENGINE=MyISAM DEFAULT CHARSET=latin1;

--
-- Dumping data for table `likedcommunity`
--

INSERT INTO `likedcommunity` (`user_id`, `c_id`) VALUES
(7, 48);

-- --------------------------------------------------------

--
-- Table structure for table `ranking`
--

CREATE TABLE `ranking` (
  `com_id` int(10) NOT NULL,
  `user_id` int(10) NOT NULL,
  `rank` int(1) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `ranking`
--

INSERT INTO `ranking` (`com_id`, `user_id`, `rank`) VALUES
(1, 7, 5),
(2, 0, 1),
(2, 7, 4),
(45, 7, 4),
(46, 7, 3),
(47, 7, 5),
(48, 7, 5),
(49, 7, 3),
(50, 7, 4),
(51, 7, 5),
(52, 7, 2);

-- --------------------------------------------------------

--
-- Table structure for table `uml`
--

CREATE TABLE `uml` (
  `UMLid` int(10) NOT NULL,
  `UMLimage` blob NOT NULL,
  `uml_about` varchar(1000) NOT NULL,
  `uml_name` varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `umllist`
--

CREATE TABLE `umllist` (
  `user_id` int(10) NOT NULL,
  `UMLid` int(10) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `user_id` int(10) NOT NULL,
  `user_email` varchar(250) NOT NULL,
  `user_name` varchar(50) NOT NULL,
  `user_about` varchar(500) DEFAULT NULL,
  `user_password` varchar(50) NOT NULL,
  `user_image` varchar(100) NOT NULL DEFAULT 'assets/media/images/avaters/default.png'
) ENGINE=MyISAM DEFAULT CHARSET=latin1;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`user_id`, `user_email`, `user_name`, `user_about`, `user_password`, `user_image`) VALUES
(7, 'KAMAL@GMAIL.COM', 'Kamalludin Nazari', 'Kamal is a good developer', 'fcit123@', 'assets/media/images/avaters/7.png'),
(0, 'jamshid@gmail.com', 'Jamshid Nazari', 'A web developer and programmer', 'FCIT123@', 'assets/media/images/avaters/default.png');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `communities`
--
ALTER TABLE `communities`
  ADD PRIMARY KEY (`c_id`);

--
-- Indexes for table `likedcommunity`
--
ALTER TABLE `likedcommunity`
  ADD PRIMARY KEY (`user_id`,`c_id`);

--
-- Indexes for table `ranking`
--
ALTER TABLE `ranking`
  ADD PRIMARY KEY (`com_id`,`user_id`);

--
-- Indexes for table `uml`
--
ALTER TABLE `uml`
  ADD PRIMARY KEY (`UMLid`);

--
-- Indexes for table `umllist`
--
ALTER TABLE `umllist`
  ADD PRIMARY KEY (`user_id`,`UMLid`),
  ADD KEY `UMLid` (`UMLid`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`user_id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `communities`
--
ALTER TABLE `communities`
  MODIFY `c_id` int(10) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=53;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `user_id` int(10) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=14;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `umllist`
--
ALTER TABLE `umllist`
  ADD CONSTRAINT `umllist_ibfk_1` FOREIGN KEY (`UMLid`) REFERENCES `uml` (`UMLid`) ON DELETE CASCADE ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
