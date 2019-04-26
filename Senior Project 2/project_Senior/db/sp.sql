-- phpMyAdmin SQL Dump
-- version 4.7.4
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Nov 01, 2018 at 11:47 PM
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
  `c_rate` decimal(1,1) NOT NULL DEFAULT '0.0',
  `c_participants` int(10) NOT NULL DEFAULT '0',
  `c_opensource` varchar(3) DEFAULT NULL,
  `c_link` varchar(200) DEFAULT NULL,
  `c_image` blob
) ENGINE=MyISAM DEFAULT CHARSET=latin1;

--
-- Dumping data for table `communities`
--

INSERT INTO `communities` (`c_id`, `c_name`, `c_catagory`, `c_creator`, `c_about`, `c_rate`, `c_participants`, `c_opensource`, `c_link`, `c_image`) VALUES
(1, 'Java', '', '0', 'Java was developed by James Goslin to maket he work of programmer easier', '0.9', 534, NULL, NULL, NULL),
(2, 'jQuery', '', '0', 'jQuery was developed by some mother fucker to make the work of developers easier in case of developing any aria of life', '0.9', 534, NULL, NULL, NULL),
(6, 'Javascript', 'Language', '0', 'Javascript is cool', '0.0', 0, NULL, NULL, NULL),
(7, 'PHP', 'Language', '0', 'PHP is a cool language', '0.0', 0, 'yes', 'https://stackoverflow.com/questions/13152927/how-to-use-radio-on-change-event', NULL),
(8, 'Javascripot', 'Language', '1', 'PHP is cool', '0.0', 0, 'yes', 'https://stackoverflow.com/questions/13152927/how-to-use-radio-on-change-event', NULL),
(9, 'C++', 'Language', '1', 'C++ is one of the top and fast language which was developed by rechard', '0.0', 0, 'no', '', NULL),
(10, 'FusionCharts', 'Library', '0', 'The Dojo Foundation was a non-profit organization created with the goal to promote the adoption of the toolkit. In 2016, the foundation merged with jQuery Foundation to become JS Foundation.[5][6][7]', '0.9', 760, 'Yes', 'www.github.com/FusionCharts', NULL),
(11, 'Dojo Toolkit', 'Language', '0', 'le client-side web development. For example, Dojo abstracts the differences among diverse browsers to provide APIs that will work on all of them (it', '0.9', 551, 'Yes', 'www.github.com/Dojo Toolkit', NULL),
(12, 'FusionCharts', 'Library', '0', 'dependencies; it provides build tools for optimizing JavaScript and CSS, generating documentation, and unit testing; it supports internationalization, localization, and accessibility; and it provides a rich suite of commonly needed ', '0.9', 784, 'Yes', 'www.github.com/FusionCharts', NULL),
(13, 'p5.js', 'Language', '0', ' (or more specifically JavaScript toolkit) designed to ease the rapid development of cross-platform, JavaScript/Ajax-based applications and web sites. It was started by Alex Russell, ', '0.9', 586, 'Yes', 'www.github.com/p5.js', NULL),
(14, 'Prototype JavaScript Framework', 'Library', '0', 'The Dojo Foundation was a non-profit organization created with the goal to promote the adoption of the toolkit. In 2016, the foundation merged with jQuery Foundation to become JS Foundation.[5][6][7]', '0.0', 348, 'Yes', 'www.github.com/Prototype JavaScript Framework', NULL),
(15, 'Google Polymer', 'Library', '0', 'pletely open-source. The entire toolkit can be downloaded as a ZIP and is also hosted on the Google CDN. The toolkit includes ab', '0.9', 826, 'Yes', 'www.github.com/Google Polymer', NULL),
(16, 'Dojo Toolkit', 'Library', '0', 'dependencies; it provides build tools for optimizing JavaScript and CSS, generating documentation, and unit testing; it supports internationalization, localization, and accessibility; and it provides a rich suite of commonly needed ', '0.9', 187, 'Yes', 'www.github.com/Dojo Toolkit', NULL),
(17, 'Dojo Toolkit', 'Library', '0', 'anged and the pages presentation is updated without a need for reloading the whole page. Traditionally, this is done with the JavaScript object XMLHttpRequest. Dojo provides an abstracted wrapper (dojo.xhr) around various web b', '0.9', 145, 'Yes', 'www.github.com/Dojo Toolkit', NULL),
(18, 'Plotly', 'Language', '0', 'ters into a form sent to the server \"behind the scenes\"; the server can then reply with some JavaScript code that updates the presentation ', '0.9', 569, 'Yes', 'www.github.com/Plotly', NULL),
(19, 'Google Polymer', 'Language', '0', 'ters into a form sent to the server \"behind the scenes\"; the server can then reply with some JavaScript code that updates the presentation ', '0.9', 225, 'Yes', 'www.github.com/Google Polymer', NULL),
(20, 'FusionCharts', 'Language', '0', 'ters into a form sent to the server \"behind the scenes\"; the server can then reply with some JavaScript code that updates the presentation ', '0.9', 529, 'Yes', 'www.github.com/FusionCharts', NULL),
(21, 'FusionCharts', 'Language', '0', ' (or more specifically JavaScript toolkit) designed to ease the rapid development of cross-platform, JavaScript/Ajax-based applications and web sites. It was started by Alex Russell, ', '0.9', 469, 'Yes', 'www.github.com/FusionCharts', NULL),
(22, 'p5.js', 'Library', '0', ' (or more specifically JavaScript toolkit) designed to ease the rapid development of cross-platform, JavaScript/Ajax-based applications and web sites. It was started by Alex Russell, ', '0.9', 86, 'Yes', 'www.github.com/p5.js', NULL),
(23, 'FusionCharts', 'Language', '0', 'The Dojo Foundation was a non-profit organization created with the goal to promote the adoption of the toolkit. In 2016, the foundation merged with jQuery Foundation to become JS Foundation.[5][6][7]', '0.9', 153, 'Yes', 'www.github.com/FusionCharts', NULL),
(24, 'p5.js', 'Language', '0', 'The Dojo Foundation was a non-profit organization created with the goal to promote the adoption of the toolkit. In 2016, the foundation merged with jQuery Foundation to become JS Foundation.[5][6][7]', '0.9', 958, 'Yes', 'www.github.com/p5.js', NULL),
(25, 'C', 'Language', '1', 'C is one of the oldest language which is the based of all C typed languages', '0.0', 0, 'yes', 'https://getbootstrap.com/docs/4.0/components/buttons/', NULL),
(26, 'Spring', 'Language', 'Kamalludin Nazari', 'asdf', '0.0', 0, 'no', '', NULL),
(27, 'Spring', 'Language', 'Kamalludin Nazari', 'asdf', '0.0', 0, 'no', '', NULL),
(28, 'Spring', 'Language', 'Kamalludin Nazari', 'asdf', '0.0', 0, 'no', '', NULL),
(29, 'Spring', 'Language', 'Kamalludin Nazari', 'something else', '0.0', 0, 'no', '', NULL),
(30, 'Spring', 'Language', 'Kamalludin Nazari', 'something else', '0.0', 0, 'no', '', NULL),
(31, 'Spring', 'Language', 'Kamalludin Nazari', 'something else', '0.0', 0, 'no', '', NULL),
(32, 'cd', 'Library', 'Kamalludin Nazari', 'This is just fucking test', '0.0', 0, 'no', '', NULL);

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
(7, 1),
(7, 2),
(7, 8),
(7, 10),
(7, 11),
(7, 13);

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
  MODIFY `c_id` int(10) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=33;

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
