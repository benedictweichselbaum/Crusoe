# Crusoe - Ein mobiles Reisetagebuch
Crusoe ermöglicht es dem Anwender alle seine Reisen digital in einem Reisetagebuch auf seinem Smartphone zu sichern. Persönliche Eindrücke und Erlebnisse kann er mit der App mit Bildern und textuellen Beschreibungen detailliert festhalten. Dabei kann der Reisende während der Reise seinen Standort stets per GPS erfassen. Seine gewählten Routen kann er hierdurch im Nachhinein in Karten ansehen und sich seine großartige Reise in Erinnerung rufen.

![image alt](https://github.com/benedictweichselbaum/Crusoe/blob/master/CrusoeStartpage.PNG)

## Funktionalitäten der App im Überblick
- Sichern von Reisen
  - Erfassung mehrerer Routen
  - Erfassung von Reisehighlights
  - Textuelle Beschreibung
  - Editieren von Reisen
  - Import und Export von Reisen (textuell)
  - Export von Reisen als JSON
- Sichern von Routen
  - Erfassung von Routenpunkten: GPS-Koordinaten, Zeitstempel
  - Erfassung von Routenhighlights
  - Textuelle Beschreibung
  - Automatisiertes Tracking mit geöffneter App
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
- Für die UI-Elemete und die Struktur der UI wurde auf das [Ionic Framework](https://ionicframework.com/) (Ionic 5) zurückgegriffen, das sich wiederum auf Angular 11 setzt.
- Um auf Dinge wie Kamera, GPS und persistenten Speicher zuzurücken wurde auf Ionic Capacitor-Plugins gesetzt, die in Angular verwendet werden können und auf einem mobilen Endgerät die nativen Sensoren und Komponenten ansprechen.
- Die Karten in der App wurden mit Leaflet realisiert und basieren auf [OpenStreetMap](https://www.openstreetmap.org/copyright)

## Architekturdokumentation
In ihrer Grobstruktur ist die App äußerst einfach aufgebaut, da sie kein verteiltes System ist. Die App funktioniert standalone und hat keine weiteren Abhängigkeiten als sich selbst. Es wird deshalb auch keine aktive Internetverbindung für eine einfache Nutzung benötigt. Die Darstellung von Karten ist jedoch nur mit aktiver Internetverbindung möglich. Die alleinstehende App-Komponente selbst beinhaltet damit sowohl Oberflächenbeschreibung als auch die Programmlogik und die Datenhaltung.

Bei der Feinstruktur muss sich die App am Angular-Framework und dessen Framework-Komponenten orientieren. Der Angular-Code selbst ist bei der App in Module und Komponenten gegliedert, wobei eine Modul potenziell mehrere Komponenten verwalten kann. Die jeweiligen Teile der App sind eigenständige Angular-Module mit meist einer Komponente. Teils gibt es auch weitere Komponenten, wo es nötig war. Eine Komponente enthält dabei Angular-typisch eine Beschreibung der Oberfläche mittels HTML, ein Cascading-Style-Sheet für die Design-Beschreibung und ein Typescript-File zur Programmierung der Komponente. 

Die App ist zunächst in drei [ion-tabs](https://ionicframework.com/docs/api/tabs/) unterteilt. Ein Tab dient zur Darstellung und Verwaltung der einzelnen Reisen, einer für die große Karte aller Reisen und der dritte zur Darstellung der Statistiken. Jeder Tab ist dabei ein Angular-Modul mit einer Komponente. Um zwischen den Tabs zu welchseln wird über die UI, der jeweilige Tab-Button gewählt. Anschließend kann mittels Angular-Routing zwischen den einzelnen Komponenten (Modulen) hin und her gewechselt werden. Auch auf alle anderen Komponenten der Anwendung (Reise, Reise-Route etc.) wird mittels dieses Routing-Mechanismus zugegriffen. Infolgedessen beinhaltet die zentrale Elternkomponente der Anwendung ausschließlich zwei HTML-Elemente.

```html
<ion-app>
  <ion-router-outlet></ion-router-outlet>
</ion-app>
```
Die ion-app kapselt die gesamte App und der route-outlet zeigt immer das Module (Komponente) an, zu der gerade die Route aktiv ist.

Über die Tabs hinaus werden sämtliche anderen "tieferen" Komponenten in eigenständigen Modulen definiert, zu diesen dann geroutet werden kann. Dazu zählt:
- journey (Einzelne Reise)
- journey-creation (Reise-Erstellungskomponente)
- route (Einzelne Reise-Route)
Jede dieser Module ist vollkommen eigenständig und bekommt keine Daten der Elternkomponente übertragen. Durch den jeweiligen Routen(URL)-Aufruf wird der Komponente signalisiert, welche Daten geholt werden müssen. Beispielsweise zeigt die folgende Route, dass von der Reise mit der ID 3 die Route 1 angezeigt werden soll: "http://localhost:4200/tabs/journeys/journey/3/route/1". Mit dieser Information kann die Komponente die richtigen Daten holen und diese anzeigen.

Es sei noch zu erwähnen, dass innerhalb der Anwendung noch weitere Komponenten zur Erstellung einer Route und zur Erstellung von Highlights verfügbar sind. Diese haben kein eigenes Modul und werden innerhalb anderer Module mitdefiniert. Diese Komponenten repräsentieren modale Dialoge und werden jeweils in einer anderen Komponente aufgerufen. So wird der Reise-Highlight-Dialog innerhalb der Reise-Komponente aufgerufen.

Die bisher beschriebenen Komponenten beschreiben vor allem den Teil der Anwendung, wie und wann etwas angezeigt wird und die jeweilige Business-Logik, die dafür notwendig sein kann (z.B. Validatoren für Eingaben). Weiterhin gibt es aber Anwendungsteile, die nichts mit der Anzeige zu tun haben, aber von den Angular-Komponenten mitgenutz werden. Für diese Programmroutinen wurden spezielle Service-Klassen erstellt, die anschließend beliebig wiederverwendet werden können. Die Service-Klassen, die verfügbar sind, sind folgende:
- Kamera-Service: Handelt das Aufrufen des Capacitor-Kamera-Plugins
- Geolocation-Service: Handelt das Aufrufen des Capacitor-Geolocation-Plugins
- Storage-Service: Handelt die Persistierung der Reisen auf dem mobilen Endgerät über das Capacitor-Storage-Plugin. Hierbei stellt der Service Lese-, Update-, Erstellungs- und Lösch-Operationen zur Verfügung.
Die jeweiligen Services sind "@Injectable" und innerhalb eines eigenen Angular-Moduls definiert. Sie können so in jedes andere Modul integiert und verwendet werden. Hierdurch kann (vor allem beim Storage-Service) oft benötigte Funktionalität leicht bedient werden und sich Code-Dopplung gespart werden.

Was noch fehlt, ist die Entität selbst die über den Storage-Service gespeichert wird. Die App speichert eine beliebige Anzahl an Reise-Objekten. Für diese Reise-Objekte ist innerhalb der App eine Entitäts-Klasse definiert. Diese beinhaltet eigene Daten und wiederum andere definierte Subobjekte, wie eine Liste an Routen, Tags und Highlights. Auch diese Objekte beinhalten zum Teil wieder Subobjekte. Final entsteht ein moderat komplexes Entitätsobjekt, dass abgespeichert werden kann.
## Weiteres
Die App wurde im Rahmen einer Gruppenarbeit erstellt, aus der drei Apps mit ähnlichen Funktionalitäten hervorgegangen sind. Die Apps wurden jedoch mit unterschiedlichen Technologien umgesetzt.
