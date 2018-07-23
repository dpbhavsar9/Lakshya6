import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormControl, Validators, FormGroupDirective, NgForm } from '@angular/forms';
import { AlertService } from 'ngx-alerts';
import { Router } from '@angular/router';
import { EngineService } from '../../services/engine.service';
import { CookieService } from 'ngx-cookie';
import { DashboardComponent } from '../../dashboard/dashboard.component';
import { UploadEvent, UploadFile, FileSystemFileEntry, FileSystemDirectoryEntry } from 'ngx-file-drop';

import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
@Component({
  selector: 'app-create-lead',
  templateUrl: './create-lead.component.html',
  styleUrls: ['./create-lead.component.scss']
})
export class CreateLeadComponent implements OnInit {

  // tslint:disable-next-line:max-line-length
  options: any = ['Mumbai', 'Delhi', 'Bengaluru', 'Ahmedabad', 'Gandhinagar', 'Hyderabad', 'Chennai', 'Kolkata', 'Pune', 'Jaipur', 'Surat', 'Lucknow', 'Kanpur', 'Nagpur', 'Patna', 'Indore', 'Thane', 'Bhopal', 'Visakhapatnam', 'Vadodara', 'Firozabad', 'Ludhiana', 'Rajkot', 'Agra', 'Siliguri', 'Nashik', 'Faridabad', 'Patiala', 'Meerut', 'Kalyan-Dombivali', 'Vasai-Virar', 'Varanasi', 'Srinagar', 'Dhanbad', 'Jodhpur', 'Amritsar', 'Raipur', 'Allahabad', 'Coimbatore', 'Jabalpur', 'Gwalior', 'Vijayawada', 'Madurai', 'Guwahati', 'Chandigarh', 'Hubli-Dharwad', 'Amroha', 'Moradabad', 'Gurgaon', 'Aligarh', 'Solapur', 'Ranchi', 'Jalandhar', 'Tiruchirappalli', 'Bhubaneswar', 'Salem', 'Warangal', 'Mira-Bhayandar', 'Thiruvananthapuram', 'Bhiwandi', 'Saharanpur', 'Guntur', 'Amravati', 'Bikaner', 'Noida', 'Jamshedpur', 'Bhilai Nagar', 'Cuttack', 'Kochi', 'Udaipur', 'Bhavnagar', 'Dehradun', 'Asansol', 'Nanded-Waghala', 'Ajmer', 'Jamnagar', 'Ujjain', 'Sangli', 'Loni', 'Jhansi', 'Pondicherry', 'Nellore', 'Jammu', 'Belagavi', 'Raurkela', 'Mangaluru', 'Tirunelveli', 'Malegaon', 'Gaya', 'Tiruppur', 'Davanagere', 'Kozhikode', 'Akola', 'Kurnool', 'Bokaro Steel City', 'Rajahmundry', 'Ballari', 'Agartala', 'Bhagalpur', 'Latur', 'Dhule', 'Korba', 'Bhilwara', 'Brahmapur', 'Mysore', 'Muzaffarpur', 'Ahmednagar', 'Kollam', 'Raghunathganj', 'Bilaspur', 'Shahjahanpur', 'Thrissur', 'Alwar', 'Kakinada', 'Nizamabad', 'Sagar', 'Tumkur', 'Hisar', 'Rohtak', 'Panipat', 'Darbhanga', 'Kharagpur', 'Aizawl', 'Ichalkaranji', 'Tirupati', 'Karnal', 'Bathinda', 'Rampur', 'Shivamogga', 'Ratlam', 'Modinagar', 'Durg', 'Shillong', 'Imphal', 'Hapur', 'Ranipet', 'Anantapur', 'Arrah', 'Karimnagar', 'Parbhani', 'Etawah', 'Bharatpur', 'Begusarai', 'New Delhi', 'Chhapra', 'Kadapa', 'Ramagundam', 'Pali', 'Satna', 'Vizianagaram', 'Katihar', 'Hardwar', 'Sonipat', 'Nagercoil', 'Thanjavur', 'Murwara (Katni)', 'Naihati', 'Sambhal', 'Nadiad', 'Yamunanagar', 'English Bazar', 'Eluru', 'Munger', 'Panchkula', 'Raayachuru', 'Panvel', 'Deoghar', 'Ongole', 'Nandyal', 'Morena', 'Bhiwani', 'Porbandar', 'Palakkad', 'Anand', 'Purnia', 'Baharampur', 'Barmer', 'Morvi', 'Orai', 'Bahraich', 'Sikar', 'Vellore', 'Singrauli', 'Khammam', 'Mahesana', 'Silchar', 'Sambalpur', 'Rewa', 'Unnao', 'Hugli-Chinsurah', 'Raiganj', 'Phusro', 'Adityapur', 'Alappuzha', 'Bahadurgarh', 'Machilipatnam', 'Rae Bareli', 'Jalpaiguri', 'Bharuch', 'Pathankot', 'Hoshiarpur', 'Baramula', 'Adoni', 'Jind', 'Tonk', 'Tenali', 'Kancheepuram', 'Vapi', 'Sirsa', 'Navsari', 'Mahbubnagar', 'Puri', 'Robertson Pet', 'Erode', 'Batala', 'Haldwani-cum-Kathgodam', 'Vidisha', 'Saharsa', 'Thanesar', 'Chittoor', 'Veraval', 'Lakhimpur', 'Sitapur', 'Hindupur', 'Santipur', 'Balurghat', 'Ganjbasoda', 'Moga', 'Proddatur', 'Srinagar', 'Medinipur', 'Habra', 'Sasaram', 'Hajipur', 'Bhuj', 'Shivpuri', 'Ranaghat', 'Shimla', 'Tiruvannamalai', 'Kaithal', 'Rajnandgaon', 'Godhra', 'Hazaribag', 'Bhimavaram', 'Mandsaur', 'Dibrugarh', 'Kolar', 'Bankura', 'Mandya', 'Dehri-on-Sone', 'Madanapalle', 'Malerkotla', 'Lalitpur', 'Bettiah', 'Pollachi', 'Khanna', 'Neemuch', 'Palwal', 'Palanpur', 'Guntakal', 'Nabadwip', 'Udupi', 'Jagdalpur', 'Motihari', 'Pilibhit', 'Dimapur', 'Mohali', 'Sadulpur', 'Rajapalayam', 'Dharmavaram', 'Kashipur', 'Sivakasi', 'Darjiling', 'Chikkamagaluru', 'Gudivada', 'Baleshwar Town', 'Mancherial', 'Srikakulam', 'Adilabad', 'Yavatmal', 'Barnala', 'Nagaon', 'Narasaraopet', 'Raigarh', 'Roorkee', 'Valsad', 'Ambikapur', 'Giridih', 'Chandausi', 'Purulia', 'Patan', 'Bagaha', 'Hardoi ', 'Achalpur', 'Osmanabad', 'Deesa', 'Nandurbar', 'Azamgarh', 'Ramgarh', 'Firozpur', 'Baripada Town', 'Karwar', 'Siwan', 'Rajampet', 'Pudukkottai', 'Anantnag', 'Tadpatri', 'Satara', 'Bhadrak', 'Kishanganj', 'Suryapet', 'Wardha', 'Ranebennuru', 'Amreli', 'Neyveli (TS)', 'Jamalpur', 'Marmagao', 'Udgir', 'Tadepalligudem', 'Nagapattinam', 'Buxar', 'Aurangabad', 'Jehanabad', 'Phagwara', 'Khair', 'Sawai Madhopur', 'Kapurthala', 'Chilakaluripet', 'Aurangabad', 'Malappuram', 'Rewari', 'Nagaur', 'Sultanpur', 'Nagda', 'Port Blair', 'Lakhisarai', 'Panaji', 'Tinsukia', 'Itarsi', 'Kohima', 'Balangir', 'Nawada', 'Jharsuguda', 'Jagtial', 'Viluppuram', 'Amalner', 'Zirakpur', 'Tanda', 'Tiruchengode', 'Nagina', 'Yemmiganur', 'Vaniyambadi', 'Sarni', 'Theni Allinagaram', 'Margao', 'Akot', 'Sehore', 'Mhow Cantonment', 'Kot Kapura', 'Makrana', 'Pandharpur', 'Miryalaguda', 'Shamli', 'Seoni', 'Ranibennur', 'Kadiri', 'Shrirampur', 'Rudrapur', 'Parli', 'Najibabad', 'Nirmal', 'Udhagamandalam', 'Shikohabad', 'Jhumri Tilaiya', 'Aruppukkottai', 'Ponnani', 'Jamui', 'Sitamarhi', 'Chirala', 'Anjar', 'Karaikal', 'Hansi', 'Anakapalle', 'Mahasamund', 'Faridkot', 'Saunda', 'Dhoraji', 'Paramakudi', 'Balaghat', 'Sujangarh', 'Khambhat', 'Muktsar', 'Rajpura', 'Kavali', 'Dhamtari', 'Ashok Nagar', 'Sardarshahar', 'Mahuva', 'Bargarh', 'Kamareddy', 'Sahibganj', 'Kothagudem', 'Ramanagaram', 'Gokak', 'Tikamgarh', 'Araria', 'Rishikesh', 'Shahdol', 'Medininagar (Daltonganj)', 'Arakkonam', 'Washim', 'Sangrur', 'Bodhan', 'Fazilka', 'Palacole', 'Keshod', 'Sullurpeta', 'Wadhwan', 'Gurdaspur', 'Vatakara', 'Tura', 'Narnaul', 'Kharar', 'Yadgir', 'Ambejogai', 'Ankleshwar', 'Savarkundla', 'Paradip', 'Virudhachalam', 'Kanhangad', 'Kadi', 'Srivilliputhur', 'Gobindgarh', 'Tindivanam', 'Mansa', 'Taliparamba', 'Manmad', 'Tanuku', 'Rayachoti', 'Virudhunagar', 'Koyilandy', 'Jorhat', 'Karur', 'Valparai', 'Srikalahasti', 'Neyyattinkara', 'Bapatla', 'Fatehabad', 'Malout', 'Sankarankovil', 'Tenkasi', 'Ratnagiri', 'Rabkavi Banhatti', 'Sikandrabad', 'Chaibasa', 'Chirmiri', 'Palwancha', 'Bhawanipatna', 'Kayamkulam', 'Pithampur', 'Nabha', 'Shahabad, Hardoi', 'Dhenkanal', 'Uran Islampur', 'Gopalganj', 'Bongaigaon City', 'Palani', 'Pusad', 'Sopore', 'Pilkhuwa', 'Tarn Taran', 'Renukoot', 'Mandamarri', 'Shahabad', 'Barbil', 'Koratla', 'Madhubani', 'Arambagh', 'Gohana', 'Ladnu', 'Pattukkottai', 'Sirsi', 'Sircilla', 'Tamluk', 'Jagraon', 'AlipurdUrban Agglomerationr', 'Alirajpur', 'Tandur', 'Naidupet', 'Tirupathur', 'Tohana', 'Ratangarh', 'Dhubri', 'Masaurhi', 'Visnagar', 'Vrindavan', 'Nokha', 'Nagari', 'Narwana', 'Ramanathapuram', 'Ujhani', 'Samastipur', 'Laharpur', 'Sangamner', 'Nimbahera', 'Siddipet', 'Suri', 'Diphu', 'Jhargram', 'Shirpur-Warwade', 'Tilhar', 'Sindhnur', 'Udumalaipettai', 'Malkapur', 'Wanaparthy', 'Gudur', 'Kendujhar', 'Mandla', 'Mandi', 'Nedumangad', 'North Lakhimpur', 'Vinukonda', 'Tiptur', 'Gobichettipalayam', 'Sunabeda', 'Wani', 'Upleta', 'Narasapuram', 'Nuzvid', 'Tezpur', 'Una', 'Markapur', 'Sheopur', 'Thiruvarur', 'Sidhpur', 'Sahaswan', 'Suratgarh', 'Shajapur', 'Rayagada', 'Lonavla', 'Ponnur', 'Kagaznagar', 'Gadwal', 'Bhatapara', 'Kandukur', 'Sangareddy', 'Unjha', 'Lunglei', 'Karimganj', 'Kannur', 'Bobbili', 'Mokameh', 'Talegaon Dabhade', 'Anjangaon', 'Mangrol', 'Sunam', 'Gangarampur', 'Thiruvallur', 'Tirur', 'Rath', 'Jatani', 'Viramgam', 'Rajsamand', 'Yanam', 'Kottayam', 'Panruti', 'Dhuri', 'Namakkal', 'Kasaragod', 'Modasa', 'Rayadurg', 'Supaul', 'Kunnamkulam', 'Umred', 'Bellampalle', 'Sibsagar', 'Mandi Dabwali', 'Ottappalam', 'Dumraon', 'Samalkot', 'Jaggaiahpet', 'Goalpara', 'Tuni', 'Lachhmangarh', 'Bhongir', 'Amalapuram', 'Firozpur Cantt.', 'Vikarabad', 'Thiruvalla', 'Sherkot', 'Palghar', 'Shegaon', 'Jangaon', 'Bheemunipatnam', 'Panna', 'Thodupuzha', 'KathUrban Agglomeration', 'Palitana', 'Arwal', 'Venkatagiri', 'Kalpi', 'Rajgarh (Churu)', 'Sattenapalle', 'Arsikere', 'Ozar', 'Thirumangalam', 'Petlad', 'Nasirabad', 'Phaltan', 'Rampurhat', 'Nanjangud', 'Forbesganj', 'Tundla', 'BhabUrban Agglomeration', 'Sagara', 'Pithapuram', 'Sira', 'Bhadrachalam', 'Charkhi Dadri', 'Chatra', 'Palasa Kasibugga', 'Nohar', 'Yevla', 'Sirhind Fatehgarh Sahib', 'Bhainsa', 'Parvathipuram', 'Shahade', 'Chalakudy', 'Narkatiaganj', 'Kapadvanj', 'Macherla', 'Raghogarh-Vijaypur', 'Rupnagar', 'Naugachhia', 'Sendhwa', 'Byasanagar', 'Sandila', 'Gooty', 'Salur', 'Nanpara', 'Sardhana', 'Vita', 'Gumia', 'Puttur', 'Jalandhar Cantt.', 'Nehtaur', 'Changanassery', 'Mandapeta', 'Dumka', 'Seohara', 'Umarkhed', 'Madhupur', 'Vikramasingapuram', 'Punalur', 'Kendrapara', 'Sihor', 'Nellikuppam', 'Samana', 'Warora', 'Nilambur', 'Rasipuram', 'Ramnagar', 'Jammalamadugu', 'Nawanshahr', 'Thoubal', 'Athni', 'Cherthala', 'Sidhi', 'Farooqnagar', 'Peddapuram', 'Chirkunda', 'Pachora', 'Madhepura', 'Pithoragarh', 'Tumsar', 'Phalodi', 'Tiruttani', 'Rampura Phul', 'Perinthalmanna', 'Padrauna', 'Pipariya', 'Dalli-Rajhara', 'Punganur', 'Mattannur', 'Mathura', 'Thakurdwara', 'Nandivaram-Guduvancheri', 'Mulbagal', 'Manjlegaon', 'Wankaner', 'Sillod', 'Nidadavole', 'Surapura', 'Rajagangapur', 'Sheikhpura', 'Parlakhemundi', 'Kalimpong', 'Siruguppa', 'Arvi', 'Limbdi', 'Barpeta', 'Manglaur', 'Repalle', 'Mudhol', 'Shujalpur', 'Mandvi', 'Thangadh', 'Sironj', 'Nandura', 'Shoranur', 'Nathdwara', 'Periyakulam', 'Sultanganj', 'Medak', 'Narayanpet', 'Raxaul Bazar', 'Rajauri', 'Pernampattu', 'Nainital', 'Ramachandrapuram', 'Vaijapur', 'Nangal', 'Sidlaghatta', 'Punch', 'Pandhurna', 'Wadgaon Road', 'Talcher', 'Varkala', 'Pilani', 'Nowgong', 'Naila Janjgir', 'Mapusa', 'Vellakoil', 'Merta City', 'Sivaganga', 'Mandideep', 'Sailu', 'Vyara', 'Kovvur', 'Vadalur', 'Nawabganj', 'Padra', 'Sainthia', 'Siana', 'Shahpur', 'Sojat', 'Noorpur', 'Paravoor', 'Murtijapur', 'Ramnagar', 'Sundargarh', 'Taki', 'Saundatti-Yellamma', 'Pathanamthitta', 'Wadi', 'Rameshwaram', 'Tasgaon', 'Sikandra Rao', 'Sihora', 'Tiruvethipuram', 'Tiruvuru', 'Mehkar', 'Peringathur', 'Perambalur', 'Manvi', 'Zunheboto', 'Mahnar Bazar', 'Attingal', 'Shahbad', 'Puranpur', 'Nelamangala', 'Nakodar', 'Lunawada', 'Murshidabad', 'Mahe', 'Lanka', 'Rudauli', 'Tuensang', 'Lakshmeshwar', 'Zira', 'Yawal', 'Thana Bhawan', 'Ramdurg', 'Pulgaon', 'Sadasivpet', 'Nargund', 'Neem-Ka-Thana', 'Memari', 'Nilanga', 'Naharlagun', 'Pakaur', 'Wai', 'Tarikere', 'Malavalli', 'Raisen', 'Lahar', 'Uravakonda', 'Savanur', 'Sirohi', 'Udhampur', 'Umarga', 'Pratapgarh', 'Lingsugur', 'Usilampatti', 'Palia Kalan', 'Wokha', 'Rajpipla', 'Vijayapura', 'Rawatbhata', 'Sangaria', 'Paithan', 'Rahuri', 'Patti', 'Zaidpur', 'Lalsot', 'Maihar', 'Vedaranyam', 'Nawapur', 'Solan', 'Vapi', 'Sanawad', 'Warisaliganj', 'Revelganj', 'Sabalgarh', 'Tuljapur', 'Simdega', 'Musabani', 'Kodungallur', 'Phulabani', 'Umreth', 'Narsipatnam', 'Nautanwa', 'Rajgir', 'Yellandu', 'Sathyamangalam', 'Pilibanga', 'Morshi', 'Pehowa', 'Sonepur', 'Pappinisseri', 'Zamania', 'Mihijam', 'Purna', 'Puliyankudi', 'Shikarpur, Bulandshahr', 'Umaria', 'Porsa', 'Naugawan Sadat', 'Fatehpur Sikri', 'Manuguru', 'Udaipur', 'Pipar City', 'Pattamundai', 'Nanjikottai', 'Taranagar', 'Yerraguntla', 'Satana', 'Sherghati', 'Sankeshwara', 'Madikeri', 'Thuraiyur', 'Sanand', 'Rajula', 'Kyathampalle', 'Shahabad, Rampur', 'Tilda Newra', 'Narsinghgarh', 'Chittur-Thathamangalam', 'Malaj Khand', 'Sarangpur', 'Robertsganj', 'Sirkali', 'Radhanpur', 'Tiruchendur', 'Utraula', 'Patratu', 'Vijainagar, Ajmer', 'Periyasemur', 'Pathri', 'Sadabad', 'Talikota', 'Sinnar', 'Mungeli', 'Sedam', 'Shikaripur', 'Sumerpur', 'Sattur', 'Sugauli', 'Lumding', 'Vandavasi', 'Titlagarh', 'Uchgaon', 'Mokokchung', 'Paschim Punropara', 'Sagwara', 'Ramganj Mandi', 'Tarakeswar', 'Mahalingapura', 'Dharmanagar', 'Mahemdabad', 'Manendragarh', 'Uran', 'Tharamangalam', 'Tirukkoyilur', 'Pen', 'Makhdumpur', 'Maner', 'Oddanchatram', 'Palladam', 'Mundi', 'Nabarangapur', 'Mudalagi', 'Samalkha', 'Nepanagar', 'Karjat', 'Ranavav', 'Pedana', 'Pinjore', 'Lakheri', 'Pasan', 'Puttur', 'Vadakkuvalliyur', 'Tirukalukundram', 'Mahidpur', 'Mussoorie', 'Muvattupuzha', 'Rasra', 'Udaipurwati', 'Manwath', 'Adoor', 'Uthamapalayam', 'Partur', 'Nahan', 'Ladwa', 'Mankachar', 'Nongstoin', 'Losal', 'Sri Madhopur', 'Ramngarh', 'Mavelikkara', 'Rawatsar', 'Rajakhera', 'Lar', 'Lal Gopalganj Nindaura', 'Muddebihal', 'Sirsaganj', 'Shahpura', 'Surandai', 'Sangole', 'Pavagada', 'Tharad', 'Mansa', 'Umbergaon', 'Mavoor', 'Nalbari', 'Talaja', 'Malur', 'Mangrulpir', 'Soro', 'Shahpura', 'Vadnagar', 'Raisinghnagar', 'Sindhagi', 'Sanduru', 'Sohna', 'Manavadar', 'Pihani', 'Safidon', 'Risod', 'Rosera', 'Sankari', 'Malpura', 'Sonamukhi', 'Shamsabad, Agra', 'Nokha', 'PandUrban Agglomeration', 'Mainaguri', 'Afzalpur', 'Shirur', 'Salaya', 'Shenkottai', 'Pratapgarh', 'Vadipatti', 'Nagarkurnool', 'Savner', 'Sasvad', 'Rudrapur', 'Soron', 'Sholingur', 'Pandharkaoda', 'Perumbavoor', 'Maddur', 'Nadbai', 'Talode', 'Shrigonda', 'Madhugiri', 'Tekkalakote', 'Seoni-Malwa', 'Shirdi', 'SUrban Agglomerationr', 'Terdal', 'Raver', 'Tirupathur', 'Taraori', 'Mukhed', 'Manachanallur', 'Rehli', 'Sanchore', 'Rajura', 'Piro', 'Mudabidri', 'Vadgaon Kasba', 'Nagar', 'Vijapur', 'Viswanatham', 'Polur', 'Panagudi', 'Manawar', 'Tehri', 'Samdhan', 'Pardi', 'Rahatgarh', 'Panagar', 'Uthiramerur', 'Tirora', 'Rangia', 'Sahjanwa', 'Wara Seoni', 'Magadi', 'Rajgarh (Alwar)', 'Rafiganj', 'Tarana', 'Rampur Maniharan', 'Sheoganj', 'Raikot', 'Pauri', 'Sumerpur', 'Navalgund', 'Shahganj', 'Marhaura', 'Tulsipur', 'Sadri', 'Thiruthuraipoondi', 'Shiggaon', 'Pallapatti', 'Mahendragarh', 'Sausar', 'Ponneri', 'Mahad', 'Lohardaga', 'Tirwaganj', 'Margherita', 'Sundarnagar', 'Rajgarh', 'Mangaldoi', 'Renigunta', 'Longowal', 'Ratia', 'Lalgudi', 'Shrirangapattana', 'Niwari', 'Natham', 'Unnamalaikadai', 'PurqUrban Agglomerationzi', 'Shamsabad, Farrukhabad', 'Mirganj', 'Todaraisingh', 'Warhapur', 'Rajam', 'Urmar Tanda', 'Lonar', 'Powayan', 'P.N.Patti', 'Palampur', 'Srisailam Project (Right Flank Colony) Township', 'Sindagi', 'Sandi', 'Vaikom', 'Malda', 'Tharangambadi', 'Sakaleshapura', 'Lalganj', 'Malkangiri', 'Rapar', 'Mauganj', 'Todabhim', 'Srinivaspur', 'Murliganj', 'Reengus', 'Sawantwadi', 'Tittakudi', 'Lilong', 'Rajaldesar', 'Pathardi', 'Achhnera', 'Pacode', 'Naraura', 'Nakur', 'Palai', 'Morinda, India', 'Manasa', 'Nainpur', 'Sahaspur', 'Pauni', 'Prithvipur', 'Ramtek', 'Silapathar', 'Songadh', 'Safipur', 'Sohagpur', 'Mul', 'Sadulshahar', 'Phillaur', 'Sambhar', 'Prantij', 'Nagla', 'Pattran', 'Mount Abu', 'Reoti', 'Tenu dam-cum-Kathhara', 'Panchla', 'Sitarganj', 'Pasighat', 'Motipur', 'O\' Valley', 'Raghunathpur', 'Suriyampalayam', 'Qadian', 'Rairangpur', 'Silvassa', 'Nowrozabad (Khodargama)', 'Mangrol', 'Soyagaon', 'Sujanpur', 'Manihari', 'Sikanderpur', 'Mangalvedhe', 'Phulera', 'Ron', 'Sholavandan', 'Saidpur', 'Shamgarh', 'Thammampatti', 'Maharajpur', 'Multai', 'Mukerian', 'Sirsi', 'Purwa', 'Sheohar', 'Namagiripettai', 'Parasi', 'Lathi', 'Lalganj', 'Narkhed', 'Mathabhanga', 'Shendurjana', 'Peravurani', 'Mariani', 'Phulpur', 'Rania', 'Pali', 'Pachore', 'Parangipettai', 'Pudupattinam', 'Panniyannur', 'Maharajganj', 'Rau', 'Monoharpur', 'Mandawa', 'Marigaon', 'Pallikonda', 'Pindwara', 'Shishgarh', 'Patur', 'Mayang Imphal', 'Mhowgaon', 'Guruvayoor', 'Mhaswad', 'Sahawar', 'Sivagiri', 'Mundargi', 'Punjaipugalur', 'Kailasahar', 'Samthar', 'Sakti', 'Sadalagi', 'Silao', 'Mandalgarh', 'Loha', 'Pukhrayan', 'Padmanabhapuram', 'Belonia', 'Saiha', 'Srirampore', 'Talwara', 'Puthuppally', 'Khowai', 'Vijaypur', 'Takhatgarh', 'Thirupuvanam', 'Adra', 'Piriyapatna', 'Obra', 'Adalaj', 'Nandgaon', 'Barh', 'Chhapra', 'Panamattom', 'Niwai', 'Bageshwar', 'Tarbha', 'Adyar', 'Narsinghgarh', 'Warud', 'Asarganj', 'Sarsod'];

  filteredOptions: Observable<string[]>;

  url: any;
  createLeadForm: FormGroup;
  companyList: any[] = [];
  projectList: any[] = [];
  allLeadTypeList: any[] = [];
  allLeadCategoryList: any[] = [];
  leadTypeList: any[] = [];
  teamList: any[] = [];
  assignToUserList: any[];
  fileToUpload: File = null;
  // tslint:disable-next-line:max-line-length
  priorityList: any[] = [{ value: 'High', viewValue: 'High' }, { value: 'Medium', viewValue: 'Medium' }, { value: 'Low', viewValue: 'Low' }];
  data = {
    LeadID: '',
    LeadNo: '',
    LeadBacklogID: ''
  };

  leadSaved = false;
  selectedIndex: number;
  files: UploadFile[] = [];
  selectedDiamond = 1;
  defaultValue = {
    Company: { Oid: this._cookieService.get('CompanyID'), CompanyName: this._cookieService.get('CompanyName') },
    Project: { Oid: this._cookieService.get('ProjectID'), ProjectName: this._cookieService.get('ProjectName') },
    Team: { Oid: this._cookieService.get('TeamID'), TeamName: this._cookieService.get('TeamName') },
  };

  // tslint:disable-next-line:max-line-length
  constructor(private alertService: AlertService,
    private router: Router,
    private engineService: EngineService,
    private dashboard: DashboardComponent,
    private _cookieService: CookieService) { }

  ngOnInit() {

    this.prepareForm();

    this.loadCompany();
    this.loadProjects();
    this.loadLeadType();
    this.loadLeadCategory();
    this.loadTeams();
    this.loadTeamMembers();

    this.filteredOptions = this.createLeadForm.get('Location').valueChanges
      .pipe(map(value => this._filter(value)));
  }
  _filter(value: string): any {
    const filterValue = value.toLowerCase();
    return this.options.filter(option => option.toLowerCase().includes(filterValue));
  }

  prepareForm() {
    this.createLeadForm = new FormGroup({

      CompanyID: new FormControl(this.defaultValue.Company.Oid, Validators.required),
      ProjectID: new FormControl(this.defaultValue.Project.Oid, Validators.required),
      LeadType: new FormControl(1, Validators.required),
      Priority: new FormControl('Medium', Validators.required),
      Subject: new FormControl(null, Validators.required),
      LeadDescription: new FormControl(null, Validators.required),
      TeamID: new FormControl(this.defaultValue.Team.Oid, Validators.required),
      AssignTo: new FormControl(null),
      Oid: new FormControl(Number(this._cookieService.get('Oid'))),
      CompanyName: new FormControl(null, Validators.required),
      ContactPerson1: new FormControl(null),
      ContactNumber1: new FormControl(null),
      Designation1: new FormControl(null),
      ContactPerson2: new FormControl(null),
      ContactNumber2: new FormControl(null),
      Designation2: new FormControl(null),
      ContactPerson3: new FormControl(null),
      ContactNumber3: new FormControl(null),
      Designation3: new FormControl(null),
      EmailID: new FormControl(null),
      Address: new FormControl(null),
      Location: new FormControl(null),
      LeadCategory: new FormControl(this.selectedDiamond, Validators.required),
    });
  }

  diamondHover(i) {
    // console.log(i);
    this.selectedDiamond = i;
    this.createLeadForm.patchValue({ LeadCategory: i });
  }

  selectedIndexChange(val: number) {
    this.selectedIndex = val;
  }

  loadCompany() {
    // Company Dropdown - start
    this.url = 'Company/GetAllCompany';
    this.engineService.getData(this.url).toPromise()
      .then(res => {
        // console.log(res);
        this.companyList = res;
      })
      .catch(err => {
        // // console.log(err);
        this.alertService.danger('Server response error! @loadCompany');
      });
    // Company Dropdown - end
  }

  loadProjects() {
    const CompanyID = this.createLeadForm.get('CompanyID').value;
    // console.log(CompanyID);
    // Company Dropdown - start
    this.url = 'Project/GetProject';
    this.engineService.getData(this.url).toPromise()
      .then(res => {
        // console.log(res);
        this.projectList = res.filter(data => data.ProjectCompany === CompanyID);
      })
      .catch(err => {
        // // console.log(err);
        this.alertService.danger('Server response error! @loadCompany');
      });
    // Company Dropdown - end
  }

  loadTeams() {
    const ProjectID = this.createLeadForm.get('ProjectID').value;
    this.url = 'Team/GetTeamProject/' + ProjectID;
    this.engineService.getData(this.url).toPromise()
      .then(res => {
        // console.log(res);
        this.teamList = res.filter(data => data.ProjectID === ProjectID);
      })
      .catch(err => {
        this.alertService.danger('Server response error! @loadTeam');
      });
  }

  loadTeamMembers() {
    const TeamID = this.createLeadForm.get('TeamID').value;
    this.url = 'Users/GetTeamMembers/' + TeamID;
    this.engineService.getData(this.url).toPromise()
      .then(res => {
        // console.log(TeamID, '------', res);
        this.assignToUserList = res;
      })
      .catch(err => {
        // console.log(err);
        this.alertService.danger('Server response error!');
      });
  }

  loadLeadType() {
    // LeadType Dropdown - start
    this.url = 'Lead/GetLeadType';
    this.engineService.getData(this.url).toPromise()
      .then(res => {
        // console.log(res);
        // this.allLeadTypeList = res;
        this.leadTypeList = res;
      })
      .catch(err => {
        this.alertService.danger('Server response error!');
      });
    // LeadType Dropdown - end
  }

  loadLeadCategory() {
    // LeadType Dropdown - start
    this.url = 'Lead/GetLeadCategory';
    this.engineService.getData(this.url).toPromise()
      .then(res => {
        // console.log(res);
        this.allLeadCategoryList = res;
      })
      .catch(err => {
        this.alertService.danger('Server response error!');
      });
    // LeadType Dropdown - end
  }

  public dropped(event: UploadEvent) {
    this.files = event.files;
    for (const droppedFile of event.files) {
      // Is it a file?
      if (droppedFile.fileEntry.isFile) {
        const fileEntry = droppedFile.fileEntry as FileSystemFileEntry;
        fileEntry.file((file: File) => {
          // console.log('----File----',droppedFile.relativePath, file);
          this.fileToUpload = file;
          const filename = file.name;
          this.uploadFileToActivity(filename);
        });
      } else {
        // It was a directory (empty directories are added, otherwise only files)
        const fileEntry = droppedFile.fileEntry as FileSystemDirectoryEntry;
        // console.log(droppedFile.relativePath, fileEntry);
      }
    }
  }

  handleFileInput(files: FileList) {

    for (let i = 0; i < files.length; i++) {
      const fileItem = files.item(i);
      this.fileToUpload = fileItem;
      const filename = fileItem.name;

      this.uploadFileToActivity(filename);
    }

  }
  uploadFileToActivity(filename) {

    this.engineService.uploadFile(this.fileToUpload, this.data, filename).then(res => {
      // console.log('----- File Upload -----' + JSON.stringify(res._body));
    }).catch(err => {
      // console.log('----- Error UploadingFile -----' + JSON.stringify(err));
    });
  }

  updateLeadType() {

    this.leadTypeList = this.allLeadTypeList.filter(x =>
      x.CompanyID === this.createLeadForm.get('CompanyID').value && x.ProjectID === this.createLeadForm.get('ProjectID').value);
    // console.log('updateLeadType', this.leadTypeList);
  }

  createLead() {
    this.engineService.validateUser();
    if (this.createLeadForm.status === 'VALID') {
      // console.log(this.createLeadForm.value);
      // console.log(JSON.stringify(this.createLeadForm.value));
      this.url = 'Lead/PostLead';
      this.engineService.postData(this.url, this.createLeadForm.value).then(response => {
        // console.log('--------Response---------', JSON.stringify(response));
        const res = response.json();
        const res2 = JSON.parse(res);
        // console.log('--------Response---------', JSON.stringify(res2));
        this.data.LeadID = res2.LeadID;
        this.data.LeadNo = res2.LeadNo;
        this.data.LeadBacklogID = res2.LeadBacklogID;

        if (response.status === 201 || response.status === 200) {
          // this.alertService.success('Lead successfully created!');
          this.leadSaved = true;
        }
      }).catch(error => {
        // console.log(error);
        this.alertService.danger('Lead creation failed!');
      });
    }
  }
}
