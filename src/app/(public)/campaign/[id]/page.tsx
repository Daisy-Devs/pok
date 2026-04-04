import CampaignInfoSection from '@/src/features/campaign/components/CampaignInfoSection'
import LiveDonationActivity from '@/src/features/campaign/components/LiveDonationActivity'
import ProtocolTransparency from '@/src/features/campaign/components/ProtocolTransparency'
import SeeTheChange from '@/src/features/campaign/components/SeeTheChange'

interface CampaignProps {
  params: { id: string }
}
const Campaign= async({params}: CampaignProps) => {
  const {id} = await params

/*     const campaign = await fetch(`https://api.example.com/campaign/${id}`, {
    cache: "no-store",
  }).then((res) => res.json()); */
  return (
    <div className='flex flex-col space-y-20 py-15'>
      <CampaignInfoSection/>
      <ProtocolTransparency/>
      <LiveDonationActivity/>
      <SeeTheChange/>
      </div>
  )
}

export default Campaign