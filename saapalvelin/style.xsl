<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet xmlns:xsl="http://www.w3.org/1999/XSL/Transform" version="1.0">
  <xsl:output method="html" encoding="UTF-8" />

  <xsl:template match="/">
    <html>
      <head>
        <meta charset="UTF-8"/>
        <title>Viikon sää</title>
      </head>
      <body>
        <h1>Viikon sää</h1>
        <table border="1" cellpadding="4">
          <tr>
            <th>Päivämäärä</th>
            <th>Lämpötila</th>
            <th>Tuulen nopeus</th>
            <th>Säätila</th>
          </tr>
          <xsl:for-each select="saa/havainto">
            <tr>
              <td><xsl:value-of select="paivamaara"/></td>
              <td><xsl:value-of select="lampotila"/></td>
              <td><xsl:value-of select="tuulennopeus"/></td>
              <td><xsl:value-of select="saatila"/></td>
            </tr>
          </xsl:for-each>
        </table>
      </body>
    </html>
  </xsl:template>
</xsl:stylesheet>
