<script>
  // imports
  import { serverFetch } from '@lib/_helpers';
  import { stateOptions } from '@lib/stateAbbreviations';

  // components
  import {
    Button,
    Card,
    Fieldset,
    Form,
    H3,
    H6,
    Icon,
    Input,
    Main,
    Modal,
    P,
    SafeArea,
    Select,
    SubmitButton,
    Table,
    Tbody,
    Td,
    Tr,
    Title
  } from '@components';
  import { X } from 'svelte-hero-icons';

  // handlers
  const chooseCandidate = (AddressKeyFormat) => {
    updateShipToAddress(AddressKeyFormat);
    modal.candidate.show = false;
    submitted = false;
    submitHandler();
  };
  const getRates = async () => {
    modal.progress.rates.show = true;
    const result = await serverFetch({
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        AccessLicenseNumber: '6DB61306A40AE684',
        Username: 'bobmcaleavey01',
        Password: '123ReallyStrongPassword$+',
        transId: 'Tran123',
        transactionSrc: 'XOLT'
      },
      href: `https://bobthered-cors-anywhere.herokuapp.com/${'https://onlinetools.ups.com/ship/v1/rating/Shop'}`,
      body: {
        RateRequest: {
          Shipment: {
            Shipper: {
              Address: Shipper
            },
            ShipTo: {
              Address: ShipTo
            },
            Package: {
              PackagingType: {
                Code: '02'
              },
              PackageWeight: {
                UnitOfMeasurement: {
                  Code: 'LBS'
                },
                Weight: Math.ceil(+PackageInfo.Weight / +PackageInfo.Packages).toString()
              }
            }
          }
        }
      }
    });

    rates = result.RateResponse.RatedShipment.reduce((obj, { Service, TotalCharges }) => {
      const row = {
        description: serviceCodes[Service.Code],
        rate: +TotalCharges.MonetaryValue * +PackageInfo.Packages
      };
      return [...obj, row];
    }, []).sort((a, b) => {
      if (a.rate < b.rate) return -1;
      if (a.rate > b.rate) return 1;
      return 0;
    });

    console.log({ rates });

    view = 'rates';
    modal.progress.rates.show = false;
  };
  const nonValidatedRate = async () => {
    if (submitted) return;
    classification = 'Unclassified';
    submitted = true;
    try {
      await getRates();
    } catch (error) {
      modal.error.body = error;
      modal.error.show = true;
      console.log({ error });
    }
    submitted = false;
  };
  const submitHandler = async (e) => {
    try {
      e.preventDefault();
    } catch (error) {}
    if (submitted) return;
    submitted = true;
    try {
      await validateAddress();
      await getRates();
    } catch (error) {
      modal.error.body = error;
      modal.error.show = true;
      modal.progress.rates.show = false;
      modal.progress.validation.show = false;
      console.log({ error });
    }
    submitted = false;
  };
  const updateShipToAddress = ({
    AddressLine,
    PoliticalDivision1,
    PoliticalDivision2,
    PostcodePrimaryLow
  }) => {
    ShipTo = {
      AddressLine: AddressLine,
      City: PoliticalDivision2,
      StateProvinceCode: PoliticalDivision1,
      PostalCode: PostcodePrimaryLow,
      CountryCode: 'US'
    };
  };
  const validateAddress = async () => {
    modal.progress.validation.show = true;
    const result = await serverFetch({
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        AccessLicenseNumber: '6DB61306A40AE684',
        Username: 'bobmcaleavey01',
        Password: '123ReallyStrongPassword$+'
      },
      href: `https://bobthered-cors-anywhere.herokuapp.com/${'https://onlinetools.ups.com/addressvalidation/v1/3'}`,
      body: {
        XAVRequest: {
          AddressKeyFormat: {
            AddressLine: [ShipTo.AddressLine],
            PoliticalDivision2: ShipTo.City,
            PoliticalDivision1: ShipTo.StateProvinceCode,
            PostcodePrimaryLow: ShipTo.PostalCode,
            CountryCode: 'US'
          }
        }
      }
    });

    // destructure result
    const {
      XAVResponse: { Candidate, NoCandidatesIndicator }
    } = result;
    console.log({ Candidate, NoCandidatesIndicator });

    // check if no candidates available
    if (Candidate === undefined) throw 'Address could not be validated';

    // check if multiple candidates
    if (Array.isArray(Candidate)) {
      modal.progress.validation.show = false;
      modal.candidate.candidates = Candidate;
      modal.candidate.show = true;
      throw 'Multiple candidates were found';
    }

    const { AddressClassification, AddressKeyFormat } = Candidate;
    classification = AddressClassification.Description;
    updateShipToAddress(AddressKeyFormat);
    modal.progress.validation.show = false;
  };

  // props (internal)
  let classification = 'Unclassified';
  let modal = {
    candidate: {
      candidates: [],
      show: false
    },
    error: {
      body: '',
      show: false
    },
    progress: {
      rates: {
        show: false
      },
      validation: {
        show: false
      }
    }
  };
  let PackageInfo = {
    Packages: '1',
    Weight: '30'
  };
  let rates = {};
  const serviceCodes = {
    '03': 'Ground',
    '12': '3 Day Select',
    '02': '2nd Day Air',
    '59': '2nd Day Air A.M.',
    '13': 'Next Day Air Saver',
    '01': 'Next Day Air',
    '14': 'Next Day Air Early'
  };
  let Shipper = {
    AddressLine: '3177 Lehigh Street',
    City: 'Caledonia',
    StateProvinceCode: 'NY',
    PostalCode: '14423',
    CountryCode: 'US'
  };
  let ShipTo = {
    AddressLine: '3177 Lehigh Street',
    City: 'Caledonia',
    StateProvinceCode: 'NY',
    PostalCode: '14423',
    CountryCode: 'US'
  };
  // let ShipTo = {
  //   AddressLine: '5000 Lehigh Street',
  //   City: 'Caledonia',
  //   StateProvinceCode: 'NY',
  //   PostalCode: '14423',
  //   CountryCode: 'US'
  // };
  // const ShipTo = {
  //   AddressLine: 'asdf',
  //   City: 'Caledonia',
  //   StateProvinceCode: 'NY',
  //   PostalCode: '14423',
  //   CountryCode: 'US'
  // };
  // const ShipTo = {
  //   AddressLine: '',
  //   City: '',
  //   StateProvinceCode: 'NY',
  //   PostalCode: '',
  //   CountryCode: 'US'
  // };
  let submitted = false;
  let view = 'form';

  Object.assign(String.prototype, {
    toCurrency() {
      const formatter = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD'
      });
      return formatter.format(this);
    }
  });
</script>

<Title base="Employee Internal Portal - Allen Bailey Tag & Label" />

<Main>
  <SafeArea class="overflow-y-auto">
    <div class="flex flex-grow items-center justify-center">
      {#if view === 'form'}
        <Form on:submit={submitHandler}>
          <H3 class="text-[1rem] lg:text-[3rem]">UPS Ground Freight Calculation</H3>
          <div
            class="flex flex-col space-y-[1rem] lg:space-y-[0] lg:flex-row lg:flex-grow lg:space-x-[1rem]"
          >
            <div class="flex flex-col space-y-[1rem] flex-grow">
              <H6>Ship From</H6>
              <Fieldset legend="Address"><Input bind:value={Shipper.AddressLine} /></Fieldset>
              <Fieldset legend="City"><Input bind:value={Shipper.City} /></Fieldset>
              <Fieldset legend="State"
                ><Select options={stateOptions} bind:value={Shipper.StateProvinceCode} /></Fieldset
              >
              <Fieldset legend="ZIP"
                ><Input type="number" bind:value={Shipper.PostalCode} /></Fieldset
              >
            </div>
            <div class="flex flex-col space-y-[1rem] flex-grow">
              <H6>Ship To</H6>
              <Fieldset legend="Address"><Input bind:value={ShipTo.AddressLine} /></Fieldset>
              <Fieldset legend="City"><Input bind:value={ShipTo.City} /></Fieldset>
              <Fieldset legend="State"
                ><Select options={stateOptions} bind:value={ShipTo.StateProvinceCode} /></Fieldset
              >
              <Fieldset legend="ZIP"
                ><Input type="number" bind:value={ShipTo.PostalCode} /></Fieldset
              >
            </div>
            <div class="flex flex-col space-y-[1rem] flex-grow">
              <H6>Package Info</H6>
              <Fieldset legend="Total Packages"
                ><Input
                  class="text-right"
                  type="number"
                  bind:value={PackageInfo.Packages}
                /></Fieldset
              >
              <Fieldset legend="Total Weight"
                ><Input
                  class="text-right"
                  type="number"
                  bind:value={PackageInfo.Weight}
                /></Fieldset
              >
            </div>
          </div>
          <div class="flex justify-end space-x-[.5rem]">
            <SubmitButton
              class="bg-transparent hover:bg-transparent focus:bg-transparent ring-offset-1 ring-offset-gray-300 ring-black/[.0] hover:ring-offset-blue-500 focus:ring-offset-blue-500 focus:ring-blue-500/[.3] text-gray-900 dark:ring-offset-white dark:ring-white/0 dark:text-white"
              on:click={nonValidatedRate}
              {submitted}
              type="button"
            >
              Non-Validated Rate
            </SubmitButton>
            <SubmitButton {submitted}>Validated Rate</SubmitButton>
          </div>
        </Form>
      {:else if view === 'rates'}
        <div class="flex flex-col space-y-[1rem]">
          <H3 class="text-[1rem] lg:text-[3rem]">UPS Rates</H3>
          <div class="flex flex-col">
            <P>{ShipTo.AddressLine} {ShipTo.City}, {ShipTo.StateProvinceCode} {ShipTo.PostalCode}</P
            >
            <P>{classification}</P>
          </div>
          <Table>
            <Tbody>
              {#each rates as rate}
                <Tr>
                  <Td>{rate.description}</Td>
                  <Td class="text-right">{rate.rate.toString().toCurrency()}</Td>
                </Tr>
              {/each}
            </Tbody>
          </Table>
          <div class="flex justify-end">
            <Button on:click={() => (view = 'form')}>New Quote</Button>
          </div>
        </div>
      {/if}
    </div>
  </SafeArea>
</Main>

<Modal bind:show={modal.candidate.show}>
  <div class="p-[1.5rem]">
    <Card
      class="dark:bg-gray-900 relative space-y-[2rem] max-w-lg max-h-screen transform transition duration-500 {modal
        .candidate.show
        ? 'scale-[1]'
        : 'scale-[.95]'}"
    >
      <div class="flex items-center justify-between">
        <H6>Candidates</H6>
        <Button
          class="bg-transparent hover:bg-black/5 focus:bg-black/5 focus:ring-black/30 px-[.5rem]"
          on:click={() => (modal.candidate.show = !modal.candidate.show)}><Icon src={X} /></Button
        >
      </div>
      <div class="flex flex-col space-y-[.5rem]">
        {#each modal.candidate.candidates as { AddressKeyFormat }}
          <div class="flex items-center space-x-[1rem]">
            <P class="flex-grow">{AddressKeyFormat.AddressLine}, {AddressKeyFormat.Region}</P>
            <Button on:click={() => chooseCandidate(AddressKeyFormat)}>Select</Button>
          </div>
        {/each}
      </div>
      <div class="flex justify-end">
        <Button on:click={() => (modal.candidate.show = !modal.candidate.show)}>Close</Button>
      </div>
    </Card>
  </div>
</Modal>

<Modal bind:show={modal.error.show}>
  <div class="p-[1.5rem]">
    <Card
      class="dark:bg-gray-900 relative space-y-[2rem] max-w-lg max-h-screen transform transition duration-500 {modal
        .error.show
        ? 'scale-[1]'
        : 'scale-[.95]'}"
    >
      <div class="flex items-center justify-between">
        <H6>Error</H6>
        <Button
          class="bg-transparent hover:bg-black/5 focus:bg-black/5 focus:ring-black/30 px-[.5rem]"
          on:click={() => (modal.error.show = !modal.error.show)}><Icon src={X} /></Button
        >
      </div>
      <P class="overflow-auto">{modal.error.body}</P>
      <div class="flex justify-end">
        <Button
          class="bg-red-500 hover:bg-red-600 focus:bg-red-600 focus:ring-red-500/30"
          on:click={() => (modal.error.show = !modal.error.show)}>Close</Button
        >
      </div>
    </Card>
  </div>
</Modal>

<Modal bind:show={modal.progress.rates.show}>
  <div class="p-[1.5rem]">
    <Card
      class="dark:bg-gray-900 relative space-y-[2rem] max-w-lg max-h-screen transform transition duration-500 {modal
        .progress.rates.show
        ? 'scale-[1]'
        : 'scale-[.95]'}"
    >
      <P class="overflow-auto">Getting rates...</P>
    </Card>
  </div>
</Modal>

<Modal bind:show={modal.progress.validation.show}>
  <div class="p-[1.5rem]">
    <Card
      class="dark:bg-gray-900 relative space-y-[2rem] max-w-lg max-h-screen transform transition duration-500 {modal
        .progress.validation.show
        ? 'scale-[1]'
        : 'scale-[.95]'}"
    >
      <P class="overflow-auto">Validating Address...</P>
    </Card>
  </div>
</Modal>
