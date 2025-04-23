--
-- Rakenne taululle `blogi`
--

CREATE TABLE `blogi` (
  `blogi_id` int(11) NOT NULL,
  `nimi` varchar(200) COLLATE utf8_swedish_ci NOT NULL,
  `kuvaus` text COLLATE utf8_swedish_ci NOT NULL,
  `kirjoittaja` varchar(100) COLLATE utf8_swedish_ci NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_swedish_ci;

--
-- Vedos taulusta `blogi`
--

INSERT INTO `blogi` (`blogi_id`, `nimi`, `kuvaus`, `kirjoittaja`) VALUES
(1, 'Seikkailuni Narniassa', 'Matkakuvaus seikkailuistani Narniassa ja maailman äärissä.', 'Prinssi Kaspian'),
(2, 'Mikä-mikä-maa', 'Maa, jossa ei ikinä tarvitse kasvaa aikuiseksi. Seikkailuja joka nurkan takana. Mitä enempää voisi toivoa?', 'Tiikerililja');

-- --------------------------------------------------------

--
-- Rakenne taululle `blogikirjoitus`
--

CREATE TABLE `blogikirjoitus` (
  `kirjoitus_id` int(11) NOT NULL,
  `otsikko` varchar(200) COLLATE utf8_swedish_ci NOT NULL,
  `teksti` text COLLATE utf8_swedish_ci NOT NULL,
  `julkaisuaika` datetime NOT NULL,
  `blogi_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_swedish_ci;

--
-- Vedos taulusta `blogikirjoitus`
--

INSERT INTO `blogikirjoitus` (`kirjoitus_id`, `otsikko`, `teksti`, `julkaisuaika`, `blogi_id`) VALUES
(1, 'Valkoinen noita', 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam consequat rutrum blandit. Donec facilisis vel quam eget maximus. Cras sagittis, justo at imperdiet consectetur, augue erat convallis nibh, vitae ultrices lorem enim vehicula velit. Quisque aliquet vel eros dictum lacinia. Pellentesque accumsan tempor maximus. Nulla facilisi. Proin eget lectus nec velit facilisis suscipit. Aliquam sagittis, massa sed laoreet tristique, arcu neque vulputate arcu, nec blandit libero ligula nec libero.', '2016-04-14 14:02:00', 1),
(2, 'Merirosvoaarre!', 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam consequat rutrum blandit. Donec facilisis vel quam eget maximus. Cras sagittis, justo at imperdiet consectetur, augue erat convallis nibh, vitae ultrices lorem enim vehicula velit. Quisque aliquet vel eros dictum lacinia. Pellentesque accumsan tempor maximus. Nulla facilisi. Proin eget lectus nec velit facilisis suscipit. Aliquam sagittis, massa sed laoreet tristique, arcu neque vulputate arcu, nec blandit libero ligula nec libero.', '2016-05-10 12:36:00', 2),
(3, 'Retki merenneitojen laguuniin', 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam consequat rutrum blandit. Donec facilisis vel quam eget maximus. Cras sagittis, justo at imperdiet consectetur, augue erat convallis nibh, vitae ultrices lorem enim vehicula velit. Quisque aliquet vel eros dictum lacinia. Pellentesque accumsan tempor maximus. Nulla facilisi. Proin eget lectus nec velit facilisis suscipit. Aliquam sagittis, massa sed laoreet tristique, arcu neque vulputate arcu, nec blandit libero ligula nec libero.', '2016-04-04 17:18:00', 2);

-- --------------------------------------------------------

-- Indexes for table `blogi`
--
ALTER TABLE `blogi`
  ADD PRIMARY KEY (`blogi_id`);

--
-- Indexes for table `blogikirjoitus`
--
ALTER TABLE `blogikirjoitus`
  ADD PRIMARY KEY (`kirjoitus_id`),
  ADD KEY `blogi_id` (`blogi_id`);
  
  --
-- AUTO_INCREMENT for table `blogi`
--
ALTER TABLE `blogi`
  MODIFY `blogi_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;
--
-- AUTO_INCREMENT for table `blogikirjoitus`
--
ALTER TABLE `blogikirjoitus`
  MODIFY `kirjoitus_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;
--
