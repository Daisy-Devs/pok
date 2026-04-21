import CampaignInfoSection from '@/src/features/campaign/components/CampaignInfoSection'
import LiveDonationActivity from '@/src/features/campaign/components/LiveDonationActivity'
import ProtocolTransparency from '@/src/features/campaign/components/ProtocolTransparency'
import SeeTheChange from '@/src/features/campaign/components/SeeTheChange'

interface CampaignProps {
  params: { id: string }
}
const Campaign= async({params}: CampaignProps) => {
  const {id} = await params

  return (
    <div className='flex flex-col space-y-20 py-15'>
      <CampaignInfoSection campaignId={id}/>
      <ProtocolTransparency campaignId={''} />
      <LiveDonationActivity/>
      <SeeTheChange/>
      </div>
  )
}

export default Campaign