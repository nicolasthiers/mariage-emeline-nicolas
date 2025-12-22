import React from 'react';
import {ParkingCircle, Shirt, BedDouble, Smartphone, Gift, Camera, Baby } from 'lucide-react';

interface InfoSectionProps {
  title: string;
  icon: React.ElementType;
  children: React.ReactNode;
  className?: string;
}

const InfoSection: React.FC<InfoSectionProps> = ({ title, icon: Icon, children, className = "" }) => (
  <div className={`bg-white p-6 rounded-lg shadow-lg ${className}`}>
    <div className="flex items-center mb-3">
      <Icon className="w-7 h-7 text-primary mr-3" />
      <h2 className="text-2xl font-serif text-foreground">{title}</h2>
    </div>
    <div className="text-foreground/80 space-y-2">
      {children}
    </div>
  </div>
);


const PracticalInfo: React.FC = () => {
  return (
    <div className="animate-fade-in-up">
      <h1 className="text-4xl font-serif text-primary text-center mb-12">Informations Pratiques</h1>
      <p className="text-lg text-center text-foreground/80 mb-12 max-w-2xl mx-auto md:whitespace-nowrap">
        Quelques détails pour vous aider à préparer votre venue et profiter pleinement de la fête.
      </p>
      <div className="grid md:grid-cols-2 gap-8">
        <InfoSection title="Dress Code" icon={Shirt}>
          <p className="text-justify">Nous vous invitons à vous parer de vos plus beaux atours ! 
          Les tenues de cérémonie sont vivement conseillées. Évidemment, le blanc est réservé aux stars du jour !
          </p>
        </InfoSection>
        <InfoSection title="Cadeaux" icon={Gift}>
          <p className="text-justify">Nous n'avons pas de liste de mariage : nous collectionnons surtout les souvenirs ! Une urne sera disponible si vous souhaitez contribuer à notre voyage de noces et à  nos projets futurs.</p>
        </InfoSection>
        <InfoSection title="Flash info !" icon={Smartphone}>
          <p className="text-justify" style={{ fontWeight: 'bold' }}>Cérémonies déconnectées</p>
          <p className="text-justify">Pour pouvoir pleinement profiter des cérémonies, 
            les téléphones et appareils photo personnels devront être rangés! 
            Un photographe et un vidéaste seront présents pour immortaliser tous les moments importants. 
            Ne vous inquiétez pas, l'ensemble des photos et vidéos seront disponibles après le mariage !</p>
        </InfoSection>
        <InfoSection title="Hébergements" icon={BedDouble}>
          <p className="text-justify">Pour nos invités venant de loin, voici quelques suggestions d'hôtels et chambres d'hôtes à proximité :</p>
          <p><a href="https://docs.google.com/document/d/1WyJ3RsI4EzwoUoMc7C8m4Uxt3GWs_eqd8qXSb2eOVKA/edit?usp=sharing" target='_blank' rel="noopener noreferrer" className="text-primary hover:underline">Liste des hébergements</a></p>
          <p className="text-justify">Nous vous conseillons de réserver rapidement.</p>
        </InfoSection>
        <InfoSection title="Enfants" icon={Baby} className="md:col-span-2">
          <p className="text-justify">Les enfants sont bien évidemment les bienvenus.
          Nous attirons toutefois votre attention sur le fait qu'aucun service de baby-sitting ne sera prévu : les enfants resteront donc sous la responsabilité et la surveillance de leurs parents tout au long de l'événement.</p>
          <p className="text-justify">Le domaine est vaste et comprend notamment des espaces extérieurs ainsi qu'un lac accessible. Pour que chacun puisse profiter pleinement de la fête en toute sérénité, nous comptons sur votre vigilance.</p>
        </InfoSection>
        <InfoSection title="Parking" icon={ParkingCircle} className="md:col-span-2">
          <p className="text-justify">Un parking sera disponible au lieu de réception. Pour les cérémonies, nous vous recommandons de stationner sur le parking public situé en face de la mairie.
          </p>
        </InfoSection>
      </div>
    </div>
  );
};

export default PracticalInfo;
