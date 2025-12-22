import React from 'react';
import { CalendarCheck2, Church, MapPin, Utensils, Moon, Wine, Camera } from 'lucide-react'; // Example icons

interface EventItemProps {
  time: string;
  title: string;
  description: string;
  location?: string;
  locationLink?: string;
  icon: React.ElementType;
}

const EventItem: React.FC<EventItemProps> = ({ time, title, description, location, locationLink, icon: Icon }) => (
  <div className="flex items-start space-x-4 p-6 bg-white rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300">
    <div className="flex-shrink-0 mt-1">
      <Icon className="w-8 h-8 text-primary" />
    </div>
    <div>
      <p className="text-sm font-semibold text-primary">{time}</p>
      <h3 className="text-xl font-serif font-semibold text-foreground mb-1">{title}</h3>
      <p className="text-foreground/80 mb-2">{description}</p>
      {location && (
        <div className="flex items-center text-sm text-foreground/70">
          <MapPin className="w-4 h-4 mr-1 text-primary/80" />
          {locationLink ? (
            <a href={locationLink} target="_blank" rel="noopener noreferrer" className="hover:text-primary hover:underline">
              {location}
            </a>
          ) : (
            location
          )}
        </div>
      )}
    </div>
  </div>
);

const events = [
    {
      time: "13:00",
      title: "Rendez-vous à la mairie",
      description: "Rendez-vous à la mairie de Saint-Sulpice-la-Pointe pour la cérémonie civile.",
      location: "Mairie de Saint-Sulpice-la-Pointe, Parc Georges Spénale, 4 Av. Vialas, 81370 Saint-Sulpice-la-Pointe",
      locationLink: "https://www.google.com/maps/place/H%C3%B4tel+de+Ville/@43.7756313,1.6833695,17z/data=!3m1!4b1!4m6!3m5!1s0x12ae832be28fbba3:0x6a61d6f6b2c0624!8m2!3d43.7756313!4d1.6833695!16s%2Fg%2F11j0_dxpmx?entry=ttu&g_ep=EgoyMDI1MDUyMS4wIKXMDSoASAFQAw%3D%3D", // Replace with actual Google Maps link
      icon: MapPin,
    },
    {
      time: "13:30",
      title: "Cérémonie Civile",
      description: "Union à la mairie de Saint-Sulpice-la-Pointe.",
      location: "Mairie de Saint-Sulpice-la-Pointe, Parc Georges Spénale, 4 Av. Vialas, 81370 Saint-Sulpice-la-Pointe",
      locationLink: "https://www.google.com/maps/place/H%C3%B4tel+de+Ville/@43.7756313,1.6833695,17z/data=!3m1!4b1!4m6!3m5!1s0x12ae832be28fbba3:0x6a61d6f6b2c0624!8m2!3d43.7756313!4d1.6833695!16s%2Fg%2F11j0_dxpmx?entry=ttu&g_ep=EgoyMDI1MDUyMS4wIKXMDSoASAFQAw%3D%3D", // Replace with actual Google Maps link
      icon: CalendarCheck2,

    },
    {
      time: "15:00",
      title: "Cérémonie Religieuse",
      description: "Union à l'église de Saint-Sulpice-la-Pointe.",
      location: "Église Saint-Sulpice, place de l'église, 81370 Saint-Sulpice-la-Pointe",
      locationLink: "https://www.google.com/maps/place/%C3%89glise+Saint-Sulpice+de+Saint-Sulpice-la-Pointe/@43.7750099,1.6839529,17z/data=!4m14!1m7!3m6!1s0x12ae82a63daa3743:0xb4594e9bf3801470!2s%C3%89glise+Saint-Sulpice+de+Saint-Sulpice-la-Pointe!8m2!3d43.7750061!4d1.6865278!16s%2Fg%2F11bc58nlvv!3m5!1s0x12ae82a63daa3743:0xb4594e9bf3801470!8m2!3d43.7750061!4d1.6865278!16s%2Fg%2F11bc58nlvv?entry=ttu&g_ep=EgoyMDI1MDUyMS4wIKXMDSoASAFQAw%3D%3D", // Replace with actual Google Maps link
      icon: Church,
    },
    {
      time: "17:00",
      title: "Séance Photos",
      description: "Séance photos au Château de la Busquette.",
      location: "Château de la Busquette, 577 Chem. de la Busquette, 31340 La Magdelaine-sur-Tarn",
      locationLink: "https://www.google.com/maps/place/Ch%C3%A2teau+de+la+Busquette/@43.8196814,1.5288988,17z/data=!3m1!4b1!4m9!3m8!1s0x12ac2105fef89d2f:0x54076adc0f48b5f2!5m2!4m1!1i2!8m2!3d43.8196776!4d1.5314737!16s%2Fg%2F11kblcf_dz?entry=ttu&g_ep=EgoyMDI1MDUyMS4wIKXMDSoASAFQAw%3D%3D",
      icon: Camera,
    },
    {
      time: "18:00",
      title: "Vin d'Honneur",
      description: "Célébrons ensemble autour d'un verre au Château de la Busquette.",
      location: "Château de la Busquette, 577 Chem. de la Busquette, 31340 La Magdelaine-sur-Tarn",
      locationLink: "https://www.google.com/maps/place/Ch%C3%A2teau+de+la+Busquette/@43.8196814,1.5288988,17z/data=!3m1!4b1!4m9!3m8!1s0x12ac2105fef89d2f:0x54076adc0f48b5f2!5m2!4m1!1i2!8m2!3d43.8196776!4d1.5314737!16s%2Fg%2F11kblcf_dz?entry=ttu&g_ep=EgoyMDI1MDUyMS4wIKXMDSoASAFQAw%3D%3D",
      icon: Wine,
    },
    {
      time: "20:00",
      title: "Réception & Dîner",
      description: "Place au dîner et à la fête jusqu'au bout de la nuit !",
      location: "Château de la Busquette, 577 Chem. de la Busquette, 31340 La Magdelaine-sur-Tarn",
      locationLink: "https://www.google.com/maps/place/Ch%C3%A2teau+de+la+Busquette/@43.8196814,1.5288988,17z/data=!3m1!4b1!4m9!3m8!1s0x12ac2105fef89d2f:0x54076adc0f48b5f2!5m2!4m1!1i2!8m2!3d43.8196776!4d1.5314737!16s%2Fg%2F11kblcf_dz?entry=ttu&g_ep=EgoyMDI1MDUyMS4wIKXMDSoASAFQAw%3D%3D",
      icon: Utensils,
    },
    /*{
      time: " lendemain - 11:00",
      title: "Brunch Convivial",
      description: "Pour ceux qui le souhaitent, prolongeons les festivités autour d'un brunch.",
      location: "Château de la Busquette, 577 Chem. de la Busquette, 31340 La Magdelaine-sur-Tarn",
      locationLink: "https://www.google.com/maps/place/Ch%C3%A2teau+de+la+Busquette/@43.8196814,1.5288988,17z/data=!3m1!4b1!4m9!3m8!1s0x12ac2105fef89d2f:0x54076adc0f48b5f2!5m2!4m1!1i2!8m2!3d43.8196776!4d1.5314737!16s%2Fg%2F11kblcf_dz?entry=ttu&g_ep=EgoyMDI1MDUyMS4wIKXMDSoASAFQAw%3D%3D",
      icon: Moon, // Using Moon for "next day" / evening before
    },*/
];

const Program: React.FC = () => {
  // Regrouper les événements par adresse unique
  const uniqueLocations = React.useMemo(() => {
    const locationMap = new Map<string, { location: string; locationLink?: string; displayName: string }>();
    
    events.forEach((event) => {
      if (event.location) {
        // Vérifier si c'est le Château de la Busquette (les 3 derniers événements)
        if (event.location.includes("Château de la Busquette")) {
          if (!locationMap.has("domaine")) {
            locationMap.set("domaine", {
              location: event.location,
              locationLink: event.locationLink,
              displayName: "Domaine"
            });
          }
        } else {
          // Pour les autres adresses, utiliser le titre de l'événement comme clé
          locationMap.set(event.location, {
            location: event.location,
            locationLink: event.locationLink,
            displayName: event.title
          });
        }
      }
    });
    
    return Array.from(locationMap.entries());
  }, []);

  const [selectedLocationKey, setSelectedLocationKey] = React.useState<string>(() => {
    return uniqueLocations.length > 0 ? uniqueLocations[0][0] : "";
  });

  const selectedLocation = uniqueLocations.find(([key]) => key === selectedLocationKey)?.[1];
  const mapSrc = selectedLocation?.location
    ? `https://maps.google.com/maps?q=${encodeURIComponent(selectedLocation.location)}&z=15&output=embed`
    : "https://maps.google.com/maps?q=France&z=5&output=embed";

  return (
    <div className="animate-fade-in-up">
      <h1 className="text-4xl font-serif text-primary text-center mb-12">Programme du Mariage</h1>
      <p className="text-lg text-center text-foreground/80 mb-12 max-w-2xl mx-auto">
        Voici le déroulement de cette journée spéciale. Nous avons hâte de la partager avec vous !
      </p>
      
      <div className="space-y-8">
        {events.map((event) => (
          <EventItem key={event.title} {...event} />
        ))}
      </div>

      <div className="mt-16 text-center">
        <h2 className="text-2xl font-serif text-primary mb-4">Trouver les lieux</h2>
        <p className="text-foreground/80 mb-6">
          Choisissez un moment clé pour afficher son emplacement sur la carte.
        </p>
        <div className="flex flex-wrap justify-center gap-3 mb-6">
          {uniqueLocations.map(([key, locationData]) => {
            const isSelected = key === selectedLocationKey;

            return (
              <button
                key={key}
                type="button"
                onClick={() => setSelectedLocationKey(key)}
                className={`rounded-full border px-4 py-2 text-sm font-medium transition ${
                  isSelected
                    ? "border-primary bg-primary text-white shadow-md"
                    : "border-border bg-background/60 text-foreground hover:border-primary hover:text-primary"
                }`}
              >
                {locationData.displayName}
              </button>
            );
          })}
        </div>

        {selectedLocation && (
          <>
            <p className="text-sm text-foreground/70 mb-4 max-w-xl mx-auto">
              {selectedLocation.location}
            </p>
            <div className="aspect-video bg-secondary rounded-lg shadow-md overflow-hidden">
              <iframe
                src={mapSrc}
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen={false}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title={`Carte Google Maps - ${selectedLocation.displayName}`}
              ></iframe>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Program;
