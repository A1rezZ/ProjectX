--
-- Rakenne taululle `uutiset`
--

CREATE TABLE `uutiset` (
  `uutinen_id` int(11) NOT NULL,
  `otsikko` varchar(200) COLLATE utf8_swedish_ci NOT NULL,
  `julkaisuaika` datetime NOT NULL,
  `kirjoittaja` varchar(100) COLLATE utf8_swedish_ci NOT NULL,
  `sisalto` text COLLATE utf8_swedish_ci NOT NULL,
  `paauutinen` tinyint(1) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_swedish_ci;

--
-- Vedos taulusta `uutiset`
--

INSERT INTO `uutiset` (`uutinen_id`, `otsikko`, `julkaisuaika`, `kirjoittaja`, `sisalto`, `paauutinen`) VALUES
(1, 'Kaksi lasta eksyneet metsään', '2016-05-02 07:23:00', 'Grimm', 'Puunhakkaajan lapset, poika ja tyttö, ovat kadonneet metsään. Alueella kerrotaan kummia tarinoita, että jossakin metsän siimeksessä olisi sokerista ja leivonnaisista rakennettu talo.', 1),
(2, 'Vanhus katosi merelle', '2016-04-07 16:20:00', 'Carlo Collodi', 'Vanha puunkaivertajana työskennellyt mies katosi lähdettyään merelle pienellä veneellä etsimään poikaansa. Huhujen mukaan valas nielaisi hänet.', 0),
(3, 'Tuholaisongelma ratkaistu musiikin voimalla', '2016-05-11 18:42:00', 'Grimm', 'Kaupunkia pitkään piinanneet rotat on saatu vihdoinkin hävitettyä. Tämän ihmeteon takana on salaperäinen pillipiipari.', 0),
(4, 'Kansantarinoista lastensaduiksi', '2016-05-20 11:30:00', 'Kirjatoukka', 'Kaikkien nykyään tuntemat lastensadut, kuten Lumikki, Pieni Merenneito tai Punahilkka, eivät alkujaan olleet varsinaisesti "sopivia lapsille". Vuosien kuluessa niistä poistettiin liian raakoina pidettyjä piirteitä ja lopetuksia kirjoitettiin uusiksi.\r\n\r\nPienestä merenneidosta kaikki tuntevat luultavasti parhaiten Disneyn version. Pieni merenneito rakastuu pelastamaansa prinssiin, antaa äänensä vastineeksi ihmisen jaloista ja vaikeuksien kautta saa prinssin omakseen. Alkuperäisessä tarinassa...hän saa kyllä ihmisen jalat kävelläkseen ja tanssiakseen, mutta jokainen askel on kuin veitsillä kävelyä. Prinssi menee naimisiin toisen kanssa, ja pieni merenneito kuolee, muuttuen meren vaahdoksi.\r\n\r\nSankarit ja sankarittaret eivät myöskään ole läheskään aina jaloja ja kunniallisia. Herättyään myrkytetystä unestaan - ei tosin prinssin suudelman, vaan palvelijan kompastumisen takia - Lumikki kutsuu pahan kuningattaren häihinsä. Siellä tälle annetaan polttavan kuumat rautakengät, joissa hänen on tanssittava kunnes menehtyy.', 1),
(5, 'Kuninkaalliset häät: Lasikenkä yhdisti rakastavaiset', '2016-05-16 04:41:00', 'Grimm', 'Kuninkaallisissa tanssiaisissa prinssi tanssi koko illan tuntemattoman kaunottaren kanssa, joka katosi paikalta kertomatta kuka on. Jälkeensä hän jätti vain lasisen kengän.\r\n\r\nPitkällisen etsinnän jälkeen prinssi löysi vihdoin neidon, jolle kenkä sopii. Neidon kerrotaan olevan hyvästä perheestä, mutta kovin köyhässä asemassa, käytännössä palvelija.\r\n\r\nTästä huolimatta prinssi ja neito ovat menossa naimisiin, ja häistä povataan vuosisadan suurimpia. Kaikki merkittävät aateliset on kutsuttu. Parin tulevan lapsen nimeäkin arvuutellaan jo. Onko se kenties Noki?', 1);

-- Indexes for table `uutiset`
--
ALTER TABLE `uutiset`
  ADD PRIMARY KEY (`uutinen_id`);

--
-- AUTO_INCREMENT for table `uutiset`
--
ALTER TABLE `uutiset`
  MODIFY `uutinen_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;
