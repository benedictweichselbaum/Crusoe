# Crusoe - Ein mobiles Reisetagebuch
Crusoe ermöglicht es dem Anwender alle seine Reisen digital in einem Reisetagebuch auf seinem Smartphone zu sichern. Persönliche Eindrücke und Erlebnisse kann er mit der App mit Bildern und textuellen Beschreibungen detailliert festhalten. Dabei kann der Reisende während der Reise seinen Standort stets per GPS erfassen. Seine gewählten Routen kann er hierdurch im Nachhinein in Karten ansehen und sich seine großartige Reise in Erinnerung rufen.

![image alt](https://github.com/benedictweichselbaum/Crusoe/blob/master/CrusoeStartpage.PNG)

## Funktionalitäten der App im Überblick
- Sichern von Reisen
  - Erfassung mehrerer Routen
  - Erfassung von Reisehighlights
  - Textuelle Beschreibung
- Sichern von Routen
  - Erfassung von Routenpunkten: GPS-Koordinaten, Zeitstempel
  - Erfassung von Routenhighlights
  - Textuelle Beschreibung
- Highlights (sowohl für Routenhighlights als auch für Reisehighlights möglich)
  - GPS-Koordinate
  - Bilder (aus der Galerie und per selbsterstellten Foto)
  - Textuelle Beschreibung
- Graphische Visualisierung
  - Darstellung von Routen und Reisen einzeln in einer eigenen Karte
  - Darstellung aller Reisen mit allen Routen in einer großen Karte
- Statistiken: Informationen zu den Reisen des Nutzers
- Tags: Kategorisierung von Reisen, Routen und Highlights mit selbstkonfigurierbaren Tags

## Technologiestack
- Die App wurde mit [Angular](https://angular.io/) 11 erstellt
- Um die App für Android verfügbar zu machen und für androidspezifische Designelemente wurde das [Ionic Framework](https://ionicframework.com/) (Ionic 5) verwendet
- Die Karten in der App wurden mit Leaflet realisiert und basieren auf [OpenStreetMap](https://www.openstreetmap.org/copyright)

## Architekturdokumentation
Die App ist zunächst in drei [ion-tabs](https://ionicframework.com/docs/api/tabs/) unterteilt. Ein Tab dient zur Darstellung und Verwaltung der einzelnen Reisen, einer für die große Karte aller Reisen und der dritte zur Darstellung der Statistiken.

## Weiteres
Die App wurde im Rahmen einer Gruppenarbeit erstellt, aus der drei Apps mit ähnlichen Funktionalitäten hervorgegangen sind. Die Apps wurden jedoch mit unterschiedlichen Technologien umgesetzt.
